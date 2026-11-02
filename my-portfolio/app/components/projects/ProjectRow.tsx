"use client";

import type { Ref } from "react";
import type { Project } from "app/lib/content/projects";
import { useScramble } from "./useScramble";

type ProjectRowProps = {
  project: Project;
  index: number;
  isOpen: boolean;
  buttonId: string;
  drawerId: string;
  buttonRef: Ref<HTMLButtonElement>;
  onToggle: () => void;
  onHover: (pointerType: string) => void;
};

export function ProjectRow({
  project,
  index,
  isOpen,
  buttonId,
  drawerId,
  buttonRef,
  onToggle,
  onHover,
}: ProjectRowProps) {
  const { display, scramble } = useScramble(project.title);

  return (
    <button
      id={buttonId}
      type="button"
      data-peek-row
      aria-expanded={isOpen}
      aria-controls={drawerId}
      className="pr-row-button press flex w-full items-baseline gap-4 py-3.5 text-left"
      ref={buttonRef}
      onClick={onToggle}
      onPointerEnter={(event) => {
        onHover(event.pointerType);
        if (event.pointerType === "mouse") scramble();
      }}
    >
      <span className="pr-idx text-[13px] tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="pr-body min-w-0 flex-1">
        <span className="pr-mask block">
          <span className="pr-title block text-[15px] font-medium text-ink">
            <span aria-hidden="true">{display}</span>
            <span className="sr-only">{project.title}</span>
          </span>
        </span>
        <span className="pr-mask mt-0.5 block">
          <span className="pr-summary block text-[15px] text-mute">
            {project.summary}
          </span>
        </span>
      </span>
      <span className="ruled-arrow text-faint" aria-hidden="true">
        {isOpen ? "↑" : "↓"}
      </span>
      <span className="pr-meta flex items-baseline gap-3 text-[13px] tabular-nums text-faint">
        {project.status === "live" ? (
          <span className="flex items-center gap-1.5">
            <span className="pr-live" aria-hidden="true" />
            live
          </span>
        ) : (
          <span>in progress</span>
        )}
        <span>{project.year}</span>
      </span>
    </button>
  );
}
