"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createBlueprintPlanMarker,
  deleteBlueprintPlanMarker,
  getBlueprintPlanMarkers,
  updateBlueprintPlanMarker,
} from "@/app/blueprint/plans/actions";

import type {
  BlueprintPlanMarkerType,
  DatabaseBlueprintPlanMarker,
} from "@/lib/supabase/blueprintPlanMarkers";

import { theme } from "@/lib/constants/theme";

type PlanMarkupViewerProps = {
  planId: string;
  projectId: string;
  planName: string;
  imageUrl: string;
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

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [message, setMessage] =
    useState<string | null>(null);

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
  }, [planId]);

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

          <p
            style={{
              margin: 0,
              color:
                theme.colors.textLight,
              lineHeight: 1.5,
            }}
          >
            Choose a device type, then
            click the plan to place it.
            Click a marker to edit it, or
            drag it to a new location.
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

            <button
              type="button"
              onClick={
                handleDeleteMarker
              }
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
            minWidth: "100%",
            cursor: isSaving
              ? "wait"
              : "crosshair",
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

          {!isLoading &&
            markers.map((marker) => {
              const isSelected =
                marker.id ===
                selectedMarkerId;

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