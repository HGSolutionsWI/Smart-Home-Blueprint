"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

import {
  createBlueprintPlanMarker,
  deleteBlueprintPlanMarker,
  getBlueprintPlanMarkers,
  updateBlueprintPlanMarker,
} from "@/app/blueprint/plans/actions";

import type {
  BlueprintPlanMarkerType,
  BlueprintPlanPathPoint,
  DatabaseBlueprintPlanMarker,
} from "@/lib/supabase/blueprintPlanMarkers";

import { theme } from "@/lib/constants/theme";

type PlanMarkupViewerProps = {
  planId: string;
  projectId: string;
  planName: string;
  imageUrl: string;
  initialMarkerId?: string;
};

const markerOptions: Array<{
  type: BlueprintPlanMarkerType;
  label: string;
}> = [
  {
    type: "wifi-access-point",
    label: "Wi-Fi Access Point",
  },
  {
    type: "network-drop",
    label: "Network Drop",
  },
  {
    type: "camera",
    label: "Camera",
  },
  {
    type: "tv",
    label: "TV",
  },
  {
    type: "speaker",
    label: "Speaker",
  },
  {
    type: "keypad-control",
    label: "Keypad / Control",
  },
  {
    type: "sensor",
    label: "Sensor",
  },
  {
    type: "equipment-rack",
    label: "Equipment Rack",
  },
  {
    type: "conduit-pathway",
    label: "Conduit / Pathway",
  },
  {
    type: "other",
    label: "Other",
  },
];

function getMarkerLabel(
  type: BlueprintPlanMarkerType,
): string {
  return (
    markerOptions.find(
      (option) => option.type === type,
    )?.label ?? type
  );
}

function getMarkerColor(
  type: BlueprintPlanMarkerType,
): string {
  switch (type) {
    case "wifi-access-point":
      return "#2563EB";

    case "network-drop":
      return "#0891B2";

    case "camera":
      return "#DC2626";

    case "tv":
      return "#7C3AED";

    case "speaker":
      return "#EA580C";

    case "keypad-control":
      return "#CA8A04";

    case "sensor":
      return "#16A34A";

    case "equipment-rack":
      return "#475569";

    case "conduit-pathway":
      return "#92400E";

    case "other":
    default:
      return "#6B7280";
  }
}

function getMarkerShortLabel(
  type: BlueprintPlanMarkerType,
): string {
  switch (type) {
    case "wifi-access-point":
      return "AP";

    case "network-drop":
      return "N";

    case "camera":
      return "C";

    case "tv":
      return "TV";

    case "speaker":
      return "S";

    case "keypad-control":
      return "K";

    case "sensor":
      return "SN";

    case "equipment-rack":
      return "R";

    case "conduit-pathway":
      return "P";

    case "other":
    default:
      return "•";
  }
}

export function PlanMarkupViewer({
  planId,
  projectId,
  planName,
  imageUrl,
  initialMarkerId,
}: PlanMarkupViewerProps) {
  const imageContainerRef =
    useRef<HTMLDivElement | null>(null);

  const [markers, setMarkers] = useState<
    DatabaseBlueprintPlanMarker[]
  >([]);

  const [selectedMarkerType, setSelectedMarkerType] =
    useState<BlueprintPlanMarkerType>(
      "wifi-access-point",
    );

  const [selectedMarkerId, setSelectedMarkerId] =
    useState<string | null>(null);

  const [editingMarkerType, setEditingMarkerType] =
    useState<BlueprintPlanMarkerType>(
      "wifi-access-point",
    );

  const [draftPathPoints, setDraftPathPoints] =
  useState<BlueprintPlanPathPoint[]>([]); 

  const [
  draftPointerPosition,
  setDraftPointerPosition,
] = useState<BlueprintPlanPathPoint | null>(
  null,
);

  const [editingLabel, setEditingLabel] =
    useState("");

  const [editingNotes, setEditingNotes] =
    useState("");

  const [draggingMarkerId, setDraggingMarkerId] =
    useState<string | null>(null);

  const [dragPosition, setDragPosition] =
    useState<{
      x: number;
      y: number;
    } | null>(null);

  const [
  draggingPathPoint,
  setDraggingPathPoint,
] = useState<{
  markerId: string;
  pointIndex: number;
} | null>(null);

const [
  pathPointDragPosition,
  setPathPointDragPosition,
] = useState<BlueprintPlanPathPoint | null>(
  null,
);  

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

  const [zoom, setZoom] =
  useState(1);

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

function zoomIn() {
  setZoom((currentZoom) =>
    Math.min(
      currentZoom + ZOOM_STEP,
      MAX_ZOOM,
    ),
  );
}

function zoomOut() {
  setZoom((currentZoom) =>
    Math.max(
      currentZoom - ZOOM_STEP,
      MIN_ZOOM,
    ),
  );
}

function resetZoom() {
  setZoom(1);
}  

  const selectedMarker =
    markers.find(
      (marker) =>
        marker.id === selectedMarkerId,
    ) ?? null;

  useEffect(() => {
    async function loadMarkers() {
      try {
        const savedMarkers =
          await getBlueprintPlanMarkers(
            planId,
          );

        setMarkers(savedMarkers);

if (initialMarkerId) {
  const initialMarker =
    savedMarkers.find(
      (marker) =>
        marker.id === initialMarkerId,
    );

  if (initialMarker) {
    setSelectedMarkerId(
      initialMarker.id,
    );

    setEditingMarkerType(
      initialMarker.markerType,
    );

    setEditingLabel(
      initialMarker.label,
    );

    setEditingNotes(
      initialMarker.notes ?? "",
    );
  }
}
      } catch (error) {
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to load plan markers.",
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadMarkers();
  }, [planId, initialMarkerId]);

  function getNormalizedPosition(
    clientX: number,
    clientY: number,
  ) {
    const container =
      imageContainerRef.current;

    if (!container) {
      return null;
    }

    const bounds =
      container.getBoundingClientRect();

    const x =
      (clientX - bounds.left) /
      bounds.width;

    const y =
      (clientY - bounds.top) /
      bounds.height;

    return {
      x: Math.min(
        Math.max(x, 0),
        1,
      ),
      y: Math.min(
        Math.max(y, 0),
        1,
      ),
    };
  }

  function selectMarker(
    marker: DatabaseBlueprintPlanMarker,
  ) {
    setSelectedMarkerId(marker.id);

    setEditingMarkerType(
      marker.markerType,
    );

    setEditingLabel(marker.label);

    setEditingNotes(
      marker.notes ?? "",
    );

    setMessage(null);
  }

  function clearSelection() {
    setSelectedMarkerId(null);
    setEditingLabel("");
    setEditingNotes("");
  }

  async function handlePlanClick(
  event: React.MouseEvent<HTMLDivElement>,
) {
  if (
    isSaving ||
    draggingMarkerId
  ) {
    return;
  }

  const position =
    getNormalizedPosition(
      event.clientX,
      event.clientY,
    );

  if (!position) {
    return;
  }

  if (
  selectedMarkerType ===
  "conduit-pathway"
) {
  setDraftPathPoints(
    (currentPoints) => [
      ...currentPoints,
      position,
    ],
  );

  if (draftPathPoints.length === 0) {
    setMessage(
      "Pathway started. Click again to add a bend or endpoint.",
    );
  } else {
    setMessage(
      "Point added. Continue clicking to add bends, then use Finish Pathway.",
    );
  }

  return;
}

  try {
    setIsSaving(true);
    setMessage("Saving marker...");

    const marker =
      await createBlueprintPlanMarker({
        planId,
        projectId,

        markerType:
          selectedMarkerType,

        label:
          getMarkerLabel(
            selectedMarkerType,
          ),

        xPosition:
          position.x,

        yPosition:
          position.y,
      });

    // keep the rest of your existing marker logic unchanged

      setMarkers((currentMarkers) => [
        ...currentMarkers,
        marker,
      ]);

      setMessage("Marker saved.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save marker.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveMarker() {
    if (!selectedMarker) {
      return;
    }

    try {
      setIsSaving(true);
      setMessage("Saving changes...");

      const updatedMarker =
        await updateBlueprintPlanMarker(
          selectedMarker.id,
          {
            markerType:
              editingMarkerType,

            label:
              editingLabel.trim(),

            notes:
              editingNotes.trim() || null,
          },
        );

      setMarkers((currentMarkers) =>
        currentMarkers.map((marker) =>
          marker.id === updatedMarker.id
            ? updatedMarker
            : marker,
        ),
      );

      setMessage("Marker updated.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to update marker.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteMarker() {
    if (!selectedMarker) {
      return;
    }

    try {
      setIsSaving(true);
      setMessage("Deleting marker...");

      await deleteBlueprintPlanMarker(
        selectedMarker.id,
      );

      setMarkers((currentMarkers) =>
        currentMarkers.filter(
          (marker) =>
            marker.id !==
            selectedMarker.id,
        ),
      );

      clearSelection();

      setMessage("Marker deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to delete marker.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function handleMarkerPointerDown(
    event: React.PointerEvent<HTMLButtonElement>,
    marker: DatabaseBlueprintPlanMarker,
  ) {
    if (isSaving) {
      return;
    }

    event.stopPropagation();

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    setDraggingMarkerId(marker.id);

    setDragPosition({
      x: marker.xPosition,
      y: marker.yPosition,
    });
  }

  function handleMarkerPointerMove(
    event: React.PointerEvent<HTMLButtonElement>,
    marker: DatabaseBlueprintPlanMarker,
  ) {
    if (
      draggingMarkerId !== marker.id
    ) {
      return;
    }

    event.stopPropagation();

    const position =
      getNormalizedPosition(
        event.clientX,
        event.clientY,
      );

    if (!position) {
      return;
    }

    setDragPosition(position);
  }

  async function handleMarkerPointerUp(
    event: React.PointerEvent<HTMLButtonElement>,
    marker: DatabaseBlueprintPlanMarker,
  ) {
    event.stopPropagation();

    if (
      draggingMarkerId !== marker.id
    ) {
      return;
    }

    const finalPosition =
      getNormalizedPosition(
        event.clientX,
        event.clientY,
      );

    setDraggingMarkerId(null);
    setDragPosition(null);

    if (!finalPosition) {
      return;
    }

    const movedEnough =
      Math.abs(
        finalPosition.x -
          marker.xPosition,
      ) > 0.001 ||
      Math.abs(
        finalPosition.y -
          marker.yPosition,
      ) > 0.001;

    if (!movedEnough) {
      selectMarker(marker);
      return;
    }

    try {
      setIsSaving(true);
      setMessage("Moving marker...");

      const updatedMarker =
        await updateBlueprintPlanMarker(
          marker.id,
          {
            xPosition:
              finalPosition.x,

            yPosition:
              finalPosition.y,
          },
        );

      setMarkers((currentMarkers) =>
        currentMarkers.map(
          (currentMarker) =>
            currentMarker.id ===
            updatedMarker.id
              ? updatedMarker
              : currentMarker,
        ),
      );

      if (
        selectedMarkerId ===
        updatedMarker.id
      ) {
        selectMarker(updatedMarker);
      }

      setMessage("Marker moved.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to move marker.",
      );
    } finally {
      setIsSaving(false);
    }
    }

  async function finishPathway() {
    if (draftPathPoints.length < 2) {
      setMessage(
        "Add at least two points before finishing the pathway.",
      );
      return;
    }

    try {
      setIsSaving(true);
      setMessage("Saving pathway...");

      const firstPoint =
        draftPathPoints[0];

      const lastPoint =
        draftPathPoints[
          draftPathPoints.length - 1
        ];

      const marker =
        await createBlueprintPlanMarker({
          planId,
          projectId,

          markerType:
            "conduit-pathway",

          label:
            "Conduit / Pathway",

          xPosition:
            firstPoint.x,

          yPosition:
            firstPoint.y,

          endXPosition:
            lastPoint.x,

          endYPosition:
            lastPoint.y,

          pathPoints:
            draftPathPoints,
        });

      setMarkers(
        (currentMarkers) => [
          ...currentMarkers,
          marker,
        ],
      );

      setDraftPathPoints([]);
      setDraftPointerPosition(null);

      setMessage("Pathway saved.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to save pathway.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  function cancelPathway() {
    setDraftPathPoints([]);
    setDraftPointerPosition(null);
    setMessage(
      "Pathway drawing canceled.",
    );
  }

  function addConnectedPathPoint(
  marker: DatabaseBlueprintPlanMarker,
) {
  if (
    selectedMarkerType !==
    "conduit-pathway"
  ) {
    return;
  }

  setDraftPathPoints(
    (currentPoints) => [
      ...currentPoints,
      {
        x: marker.xPosition,
        y: marker.yPosition,
        markerId: marker.id,
      },
    ],
  );

  setMessage(
    draftPathPoints.length === 0
      ? `Pathway started at ${
          marker.label ||
          getMarkerLabel(
            marker.markerType,
          )
        }.`
      : `Pathway connected to ${
          marker.label ||
          getMarkerLabel(
            marker.markerType,
          )
        }. Add another point or finish the pathway.`,
  );
}

function handlePathPointPointerDown(
  event: React.PointerEvent<SVGCircleElement>,
  marker: DatabaseBlueprintPlanMarker,
  pointIndex: number,
  point: BlueprintPlanPathPoint,
) {
  if (
    isSaving ||
    point.markerId
  ) {
    return;
  }

  event.stopPropagation();

  event.currentTarget.setPointerCapture(
    event.pointerId,
  );

  setDraggingPathPoint({
    markerId: marker.id,
    pointIndex,
  });

  setPathPointDragPosition({
    x: point.x,
    y: point.y,
  });
}

function handlePathPointPointerMove(
  event: React.PointerEvent<SVGCircleElement>,
  marker: DatabaseBlueprintPlanMarker,
  pointIndex: number,
) {
  if (
    !draggingPathPoint ||
    draggingPathPoint.markerId !== marker.id ||
    draggingPathPoint.pointIndex !== pointIndex
  ) {
    return;
  }

  event.stopPropagation();

  const position =
    getNormalizedPosition(
      event.clientX,
      event.clientY,
    );

  if (!position) {
    return;
  }

  setPathPointDragPosition({
    x: position.x,
    y: position.y,
  });
}

async function handlePathPointPointerUp(
  event: React.PointerEvent<SVGCircleElement>,
  marker: DatabaseBlueprintPlanMarker,
  pointIndex: number,
) {
  event.stopPropagation();

  if (
    !draggingPathPoint ||
    draggingPathPoint.markerId !== marker.id ||
    draggingPathPoint.pointIndex !== pointIndex ||
    !pathPointDragPosition
  ) {
    setDraggingPathPoint(null);
    setPathPointDragPosition(null);
    return;
  }

  const originalPoints =
    marker.pathPoints ?? [];

  if (
    originalPoints.length < 2 ||
    !originalPoints[pointIndex]
  ) {
    setDraggingPathPoint(null);
    setPathPointDragPosition(null);
    return;
  }

  const updatedPoints =
    originalPoints.map(
      (point, index) =>
        index === pointIndex
          ? {
              ...point,
              x: pathPointDragPosition.x,
              y: pathPointDragPosition.y,
            }
          : point,
    );

  try {
    setIsSaving(true);
    setMessage("Updating pathway...");

    const updatedMarker =
      await updateBlueprintPlanMarker(
        marker.id,
        {
          pathPoints: updatedPoints,

          xPosition:
            updatedPoints[0].x,

          yPosition:
            updatedPoints[0].y,

          endXPosition:
            updatedPoints[
              updatedPoints.length - 1
            ].x,

          endYPosition:
            updatedPoints[
              updatedPoints.length - 1
            ].y,
        },
      );

    setMarkers(
      (currentMarkers) =>
        currentMarkers.map(
          (currentMarker) =>
            currentMarker.id ===
            updatedMarker.id
              ? updatedMarker
              : currentMarker,
        ),
    );

    setMessage("Pathway updated.");
  } catch (error) {
    setMessage(
      error instanceof Error
        ? error.message
        : "Unable to update pathway.",
    );
  } finally {
    setDraggingPathPoint(null);
    setPathPointDragPosition(null);
    setIsSaving(false);
  }
}

  return (
    <div
      style={{
        display: "grid",
        gap: theme.spacing.md,
      }}
    >
      <section
        style={{
          background: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          borderRadius:
            theme.radius.large,
          padding: theme.spacing.md,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: theme.spacing.sm,
          }}
        >
          <span
            style={{
              color:
                theme.colors.textLight,
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            ADD TO PLAN
          </span>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: theme.spacing.sm,
            }}
          >
            {markerOptions.map((option) => {
              const isSelected =
                selectedMarkerType ===
                option.type;

              return (
                <button
                  key={option.type}
                  type="button"
                  onClick={() =>
                    setSelectedMarkerType(
                      option.type,
                    )
                  }
                  title={option.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",

                    border: isSelected
                      ? `2px solid ${getMarkerColor(
                          option.type,
                        )}`
                      : `1px solid ${theme.colors.border}`,

                    borderRadius:
                      theme.radius.medium,

                    background: isSelected
                      ? "#F8FAFC"
                      : theme.colors.surface,

                    color:
                      theme.colors.primaryDark,

                    padding: "8px 10px",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius:
                        "999px",

                      background:
                        getMarkerColor(
                          option.type,
                        ),

                      flexShrink: 0,
                    }}
                  />

                  {option.label}
                </button>
              );
            })}
          </div>

{selectedMarkerType === "conduit-pathway" && (
  <div
    style={{
      display: "flex",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
      alignItems: "center",
    }}
  >
    <button
      type="button"
      onClick={finishPathway}
      disabled={
        draftPathPoints.length < 2 ||
        isSaving
      }
      style={{
        border: "none",
        borderRadius: theme.radius.medium,
        background: theme.colors.primary,
        color: "#FFFFFF",
        padding: "9px 13px",
        fontWeight: 800,
        cursor:
          draftPathPoints.length < 2 ||
          isSaving
            ? "not-allowed"
            : "pointer",
        opacity:
          draftPathPoints.length < 2 ||
          isSaving
            ? 0.5
            : 1,
      }}
    >
      Finish Pathway
    </button>

    <button
      type="button"
      onClick={cancelPathway}
      disabled={
        draftPathPoints.length === 0 ||
        isSaving
      }
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.medium,
        background: theme.colors.surface,
        color: theme.colors.primaryDark,
        padding: "9px 13px",
        fontWeight: 700,
        cursor:
          draftPathPoints.length === 0 ||
          isSaving
            ? "not-allowed"
            : "pointer",
        opacity:
          draftPathPoints.length === 0 ||
          isSaving
            ? 0.5
            : 1,
      }}
    >
      Cancel
    </button>

    <span
      style={{
        color: theme.colors.textLight,
        fontSize: "0.8rem",
        fontWeight: 700,
      }}
    >
      {draftPathPoints.length === 0
        ? "Click the plan to start a pathway."
        : `${draftPathPoints.length} point${
            draftPathPoints.length === 1
              ? ""
              : "s"
          } added`}
    </span>
  </div>
)}

<p
  style={{
    margin: 0,
    color: theme.colors.textLight,
    lineHeight: 1.5,
  }}
>
  {selectedMarkerType ===
  "conduit-pathway"
    ? draftPathPoints.length === 0
      ? "Click the plan to place the pathway start point."
      : "Keep clicking to add bends or the final endpoint, then choose Finish Pathway."
    : "Choose a device type, then click the plan to place it. Click a marker to edit it, or drag it to a new location."}
</p>
        </div>
      </section>

      {selectedMarker && (
        <section
          style={{
            background: "#F8FAFC",

            border: `1px solid ${getMarkerColor(
              editingMarkerType,
            )}`,

            borderRadius:
              theme.radius.large,

            padding: theme.spacing.md,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: theme.spacing.md,
              flexWrap: "wrap",
              marginBottom:
                theme.spacing.md,
            }}
          >
            <div>
              <p
                style={{
                  color:
                    theme.colors.textLight,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  marginTop: 0,
                  marginBottom:
                    theme.spacing.xs,
                }}
              >
                SELECTED MARKER
              </p>

              <h3
                style={{
                  color:
                    theme.colors.primaryDark,
                  margin: 0,
                }}
              >
                {editingLabel ||
                  getMarkerLabel(
                    editingMarkerType,
                  )}
              </h3>
            </div>

            <button
              type="button"
              onClick={clearSelection}
              style={{
                border: `1px solid ${theme.colors.border}`,
                borderRadius:
                  theme.radius.medium,
                background:
                  theme.colors.surface,
                color:
                  theme.colors.primaryDark,
                padding: "8px 11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: theme.spacing.md,
            }}
          >
            <label
              style={{
                display: "grid",
                gap: theme.spacing.xs,
              }}
            >
              <span
                style={{
                  color:
                    theme.colors.textLight,
                  fontSize: "0.75rem",
                  fontWeight: 800,
                }}
              >
                DEVICE TYPE
              </span>

              <select
                value={editingMarkerType}
                onChange={(event) =>
                  setEditingMarkerType(
                    event.target
                      .value as BlueprintPlanMarkerType,
                  )
                }
                style={{
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius:
                    theme.radius.medium,
                  padding: "10px 11px",
                  background:
                    theme.colors.surface,
                  color:
                    theme.colors.primaryDark,
                  font: "inherit",
                }}
              >
                {markerOptions.map(
                  (option) => (
                    <option
                      key={option.type}
                      value={option.type}
                    >
                      {option.label}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label
              style={{
                display: "grid",
                gap: theme.spacing.xs,
              }}
            >
              <span
                style={{
                  color:
                    theme.colors.textLight,
                  fontSize: "0.75rem",
                  fontWeight: 800,
                }}
              >
                LABEL
              </span>

              <input
                value={editingLabel}
                onChange={(event) =>
                  setEditingLabel(
                    event.target.value,
                  )
                }
                placeholder="Example: Living Room TV"
                style={{
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius:
                    theme.radius.medium,
                  padding: "10px 11px",
                  color:
                    theme.colors.primaryDark,
                  background:
                    theme.colors.surface,
                  font: "inherit",
                }}
              />
            </label>
          </div>

          <label
            style={{
              display: "grid",
              gap: theme.spacing.xs,
              marginTop:
                theme.spacing.md,
            }}
          >
            <span
              style={{
                color:
                  theme.colors.textLight,
                fontSize: "0.75rem",
                fontWeight: 800,
              }}
            >
              NOTES
            </span>

            <textarea
              value={editingNotes}
              onChange={(event) =>
                setEditingNotes(
                  event.target.value,
                )
              }
              placeholder="Installation notes, mounting height, cable requirements, model information..."
              rows={3}
              style={{
                width: "100%",
                boxSizing: "border-box",
                resize: "vertical",
                border: `1px solid ${theme.colors.border}`,
                borderRadius:
                  theme.radius.medium,
                padding: "10px 11px",
                color:
                  theme.colors.primaryDark,
                background:
                  theme.colors.surface,
                font: "inherit",
              }}
            />
          </label>

          <div
            style={{
              display: "flex",
              gap: theme.spacing.sm,
              flexWrap: "wrap",
              marginTop:
                theme.spacing.md,
            }}
          >
            <button
              type="button"
              onClick={handleSaveMarker}
              disabled={isSaving}
              style={{
                border: "none",
                borderRadius:
                  theme.radius.medium,
                background:
                  theme.colors.primary,
                color: "#FFFFFF",
                padding: "10px 14px",
                fontWeight: 800,
                cursor: isSaving
                  ? "wait"
                  : "pointer",
              }}
            >
              Save Marker
            </button>
 {selectedMarker.markerType !== "conduit-pathway" && (
    <Link
      href={`/manual/device/new?project=${projectId}&marker=${selectedMarker.id}`}
      style={{
        display: "inline-block",
        border: `1px solid ${theme.colors.primary}`,
        borderRadius: theme.radius.medium,
        background: theme.colors.surface,
        color: theme.colors.primary,
        textDecoration: "none",
        padding: "10px 14px",
        fontWeight: 800,
      }}
    >
      Add to Smart Manual
    </Link>
  )}

  <button
              type="button"
              onClick={handleDeleteMarker}
              disabled={isSaving}
              style={{
                border: `1px solid ${theme.colors.warning}`,
                borderRadius:
                  theme.radius.medium,
                background:
                  theme.colors.surface,
                color:
                  theme.colors.warning,
                padding: "10px 14px",
                fontWeight: 800,
                cursor: isSaving
                  ? "wait"
                  : "pointer",
              }}
            >
              Delete Marker
            </button>
          </div>
        </section>
      )}

      {message && (
        <div
          style={{
            border: `1px solid ${theme.colors.border}`,
            borderRadius:
              theme.radius.medium,
            background:
              theme.colors.surface,
            padding: theme.spacing.sm,
            color: theme.colors.text,
          }}
        >
          {message}
        </div>
      )}

      <section
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    flexWrap: "wrap",

    background: theme.colors.surface,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.large,
    padding: theme.spacing.sm,
  }}
>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.sm,
      flexWrap: "wrap",
    }}
  >
    <button
      type="button"
      onClick={zoomOut}
      disabled={zoom <= MIN_ZOOM}
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.medium,
        background: theme.colors.surface,
        color: theme.colors.primaryDark,
        padding: "8px 12px",
        fontWeight: 800,
        cursor:
          zoom <= MIN_ZOOM
            ? "not-allowed"
            : "pointer",
        opacity:
          zoom <= MIN_ZOOM
            ? 0.5
            : 1,
      }}
    >
      −
    </button>

    <span
      style={{
        minWidth: "58px",
        textAlign: "center",
        color: theme.colors.primaryDark,
        fontWeight: 800,
      }}
    >
      {Math.round(zoom * 100)}%
    </span>

    <button
      type="button"
      onClick={zoomIn}
      disabled={zoom >= MAX_ZOOM}
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.medium,
        background: theme.colors.surface,
        color: theme.colors.primaryDark,
        padding: "8px 12px",
        fontWeight: 800,
        cursor:
          zoom >= MAX_ZOOM
            ? "not-allowed"
            : "pointer",
        opacity:
          zoom >= MAX_ZOOM
            ? 0.5
            : 1,
      }}
    >
      +
    </button>

    <button
      type="button"
      onClick={resetZoom}
      disabled={zoom === 1}
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radius.medium,
        background: theme.colors.surface,
        color: theme.colors.primaryDark,
        padding: "8px 12px",
        fontWeight: 700,
        cursor:
          zoom === 1
            ? "not-allowed"
            : "pointer",
        opacity:
          zoom === 1
            ? 0.5
            : 1,
      }}
    >
      Reset
    </button>
  </div>

  <span
    style={{
      color: theme.colors.textLight,
      fontSize: "0.8rem",
      fontWeight: 700,
    }}
  >
    Zoom to inspect and mark detailed areas
  </span>
</section>
      
      <div
        style={{
          background: "#E2E8F0",
          border: `1px solid ${theme.colors.border}`,
          borderRadius:
            theme.radius.large,
          padding: theme.spacing.md,
          overflow: "auto",
        }}
      >
        <div
          ref={imageContainerRef}
          onClick={handlePlanClick}
          style={{
  position: "relative",
  display: "inline-block",

  width: `${zoom * 100}%`,
  minWidth: `${zoom * 100}%`,

  cursor: isSaving
    ? "wait"
    : "crosshair",
}}

onMouseMove={(event) => {
  if (
    selectedMarkerType !==
      "conduit-pathway" ||
    draftPathPoints.length === 0
  ) {
    setDraftPointerPosition(null);
    return;
  }

  const position =
    getNormalizedPosition(
      event.clientX,
      event.clientY,
    );

  if (!position) {
    return;
  }

  setDraftPointerPosition(position);
}}

onMouseLeave={() => {
  setDraftPointerPosition(null);
}}
        >
          <img
            src={imageUrl}
            alt={planName}
            draggable={false}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              background: "#FFFFFF",
              userSelect: "none",
            }}
          />

          {selectedMarkerType ===
  "conduit-pathway" &&
  draftPathPoints.length > 0 && (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 4,
      }}
    >
      <polyline
        points={[
          ...draftPathPoints,
          ...(draftPointerPosition
            ? [draftPointerPosition]
            : []),
        ]
          .map(
            (point) =>
              `${point.x * 100},${
                point.y * 100
              }`,
          )
          .join(" ")}
        fill="none"
        stroke={getMarkerColor(
          "conduit-pathway",
        )}
        strokeWidth="3"
        strokeDasharray="8 5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />

      {draftPathPoints.map(
        (point, index) => (
          <circle
            key={`draft-${index}`}
            cx={point.x * 100}
            cy={point.y * 100}
            r="0.8"
            fill={getMarkerColor(
              "conduit-pathway",
            )}
            stroke="#FFFFFF"
            strokeWidth="0.3"
            vectorEffect="non-scaling-stroke"
          />
        ),
      )}
    </svg>
  )}

          {!isLoading &&
  markers.map((marker) => {
    const isSelected =
      marker.id === selectedMarkerId;

    /*
     * PATHWAY
     */
    if (
      marker.markerType ===
      "conduit-pathway"
    ) {
      const pathPoints =
        marker.pathPoints &&
        marker.pathPoints.length >= 2
          ? marker.pathPoints
          : marker.endXPosition !== undefined &&
              marker.endYPosition !== undefined
            ? [
                {
                  x: marker.xPosition,
                  y: marker.yPosition,
                },
                {
                  x: marker.endXPosition,
                  y: marker.endYPosition,
                },
              ]
            : [];

      const resolvedPathPoints =
        pathPoints.map((point) => {
          if (!point.markerId) {
            return point;
          }

          const connectedMarker =
            markers.find(
              (candidateMarker) =>
                candidateMarker.id ===
                point.markerId,
            );

          if (!connectedMarker) {
            return point;
          }

          return {
            ...point,
            x: connectedMarker.xPosition,
            y: connectedMarker.yPosition,
          };
        });

      if (
        resolvedPathPoints.length >= 2
      ) {
        const displayPathPoints =
  resolvedPathPoints.map(
    (point, pointIndex) => {
      const isDraggingThisPoint =
        draggingPathPoint?.markerId ===
          marker.id &&
        draggingPathPoint.pointIndex ===
          pointIndex &&
        pathPointDragPosition;

      if (isDraggingThisPoint) {
        return {
          ...point,
          x: pathPointDragPosition.x,
          y: pathPointDragPosition.y,
        };
      }

      return point;
    },
  );

const svgPoints =
  displayPathPoints
    .map(
      (point) =>
        `${point.x * 100},${
          point.y * 100
        }`,
    )
    .join(" ");

        return (
          <svg
            key={marker.id}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
              pointerEvents: "none",
              zIndex: isSelected
                ? 3
                : 1,
            }}
          >
            {/* Larger invisible click target */}
            <polyline
              points={svgPoints}
              fill="none"
              stroke="transparent"
              strokeWidth="10"
              vectorEffect="non-scaling-stroke"
              strokeLinejoin="round"
              strokeLinecap="round"
              style={{
                pointerEvents: "stroke",
                cursor: "pointer",
              }}
              onClick={(event) => {
                event.stopPropagation();
                selectMarker(marker);
              }}
            />

            {/* Visible pathway */}
            <polyline
              points={svgPoints}
              fill="none"
              stroke={getMarkerColor(
                marker.markerType,
              )}
              strokeWidth={
                isSelected ? "5" : "3"
              }
              strokeDasharray="8 5"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{
                pointerEvents: "none",
              }}
            />

            {/* Pathway points */}
            {displayPathPoints.map(
              (point, pointIndex) => {
                const isConnected =
                  Boolean(
                    point.markerId,
                  );

                return (
                  <circle
  key={`${marker.id}-${pointIndex}`}

  cx={point.x * 100}
  cy={point.y * 100}

  r={
    isSelected
      ? "1.15"
      : "0.7"
  }

  fill={
    isConnected
      ? theme.colors.primaryDark
      : getMarkerColor(
          marker.markerType,
        )
  }

  stroke="#FFFFFF"

  strokeWidth={
    isSelected
      ? "0.5"
      : "0.3"
  }

  vectorEffect="non-scaling-stroke"

  onPointerDown={(event) =>
    handlePathPointPointerDown(
      event,
      marker,
      pointIndex,
      point,
    )
  }

  onPointerMove={(event) =>
    handlePathPointPointerMove(
      event,
      marker,
      pointIndex,
    )
  }

  onPointerUp={(event) =>
    handlePathPointPointerUp(
      event,
      marker,
      pointIndex,
    )
  }

  style={{
    pointerEvents:
      isSelected &&
      !isConnected
        ? "all"
        : "none",

    cursor:
      isSelected &&
      !isConnected
        ? draggingPathPoint?.markerId ===
            marker.id &&
          draggingPathPoint.pointIndex ===
            pointIndex
          ? "grabbing"
          : "grab"
        : "default",

    touchAction: "none",
  }}
/>
                );
              },
            )}
          </svg>
        );
      }

      return null;
    }

    /*
     * NORMAL DEVICE MARKER
     */
    const isDragging =
      marker.id ===
        draggingMarkerId &&
      dragPosition;

    const xPosition =
      isDragging
        ? dragPosition.x
        : marker.xPosition;

    const yPosition =
      isDragging
        ? dragPosition.y
        : marker.yPosition;

    return (
      <button
        key={marker.id}
        type="button"
        title={
          marker.label ||
          getMarkerLabel(
            marker.markerType,
          )
        }
        onClick={(event) => {
          event.stopPropagation();

          if (
            selectedMarkerType ===
            "conduit-pathway"
          ) {
            addConnectedPathPoint(
              marker,
            );

            return;
          }

          selectMarker(marker);
        }}
        onPointerDown={(event) =>
          handleMarkerPointerDown(
            event,
            marker,
          )
        }
        onPointerMove={(event) =>
          handleMarkerPointerMove(
            event,
            marker,
          )
        }
        onPointerUp={(event) =>
          handleMarkerPointerUp(
            event,
            marker,
          )
        }
        style={{
          position: "absolute",

          left: `${
            xPosition * 100
          }%`,

          top: `${
            yPosition * 100
          }%`,

          transform:
            "translate(-50%, -50%)",

          width: isSelected
            ? "36px"
            : "30px",

          height: isSelected
            ? "36px"
            : "30px",

          borderRadius: "999px",

          display: "grid",
          placeItems: "center",

          background:
            getMarkerColor(
              marker.markerType,
            ),

          color: "#FFFFFF",

          border: isSelected
            ? "4px solid #0F172A"
            : "3px solid #FFFFFF",

          boxShadow:
            "0 4px 12px rgba(15, 23, 42, 0.25)",

          fontSize: "0.68rem",
          fontWeight: 900,

          cursor:
            draggingMarkerId ===
            marker.id
              ? "grabbing"
              : "grab",

          padding: 0,

          zIndex: isSelected
            ? 3
            : 2,

          touchAction: "none",
        }}
      >
        {getMarkerShortLabel(
          marker.markerType,
        )}
      </button>
    );
  })}
        </div>
      </div>
    </div>
  );
}