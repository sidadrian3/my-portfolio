"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Project } from "app/lib/content/projects";
import { useRevealOnce } from "../useRevealOnce";
import { ProjectPeek } from "./ProjectPeek";
import { ProjectPoster } from "./ProjectPoster";
import { ProjectRow } from "./ProjectRow";

const FINE_POINTER = "(hover: hover) and (pointer: fine)";

function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER);
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return fine;
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const baseId = useId();
  const finePointer = useFinePointer();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [hoverSlug, setHoverSlug] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const phase = useRevealOnce(listRef);
  const buttons = useRef(new Map<string, HTMLButtonElement>());

  const peekProject =
    finePointer && hoverSlug !== openSlug
      ? (projects.find((project) => project.slug === hoverSlug) ?? null)
      : null;

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== "Escape" || !openSlug) return;
    const slug = (event.target as Element).closest<HTMLElement>("li")?.dataset.slug;
    if (slug !== openSlug) return;
    buttons.current.get(openSlug)?.focus();
    setOpenSlug(null);
  };

  return (
    <>
      <ul
        ref={listRef}
        data-reveal={phase}
        className="ruled"
        onKeyDown={onKeyDown}
        onPointerLeave={() => setHoverSlug(null)}
      >
        {projects.map((project, index) => {
          const isOpen = openSlug === project.slug;
          const buttonId = `${baseId}-${project.slug}-button`;
          const drawerId = `${baseId}-${project.slug}-drawer`;

          return (
            <li
              key={project.slug}
              data-slug={project.slug}
              className="pr-row"
              style={
                {
                  "--i": index,
                  "--accent-dark": project.accent.dark,
                  "--accent-light": project.accent.light,
                } as React.CSSProperties
              }
            >
              <ProjectRow
                project={project}
                index={index}
                isOpen={isOpen}
                buttonId={buttonId}
                drawerId={drawerId}
                buttonRef={(node) => {
                  if (node) buttons.current.set(project.slug, node);
                  else buttons.current.delete(project.slug);
                }}
                onToggle={() => setOpenSlug(isOpen ? null : project.slug)}
                onHover={(pointerType) => {
                  if (pointerType !== "touch") setHoverSlug(project.slug);
                }}
              />

              <div
                id={drawerId}
                onPointerEnter={() => setHoverSlug(null)}
                role="region"
                aria-labelledby={buttonId}
                inert={!isOpen}
                className={`grid transition-[grid-template-rows] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="min-h-0 overflow-hidden">
                  <div className="flex flex-col gap-4 pb-5 pt-1 sm:flex-row">
                    <div className="w-full shrink-0 sm:w-[150px]">
                      <ProjectPoster project={project} framed />
                    </div>
                    <div className="min-w-0 space-y-2">
                      <p className="text-[15px] leading-relaxed text-mute">
                        {project.description}
                      </p>
                      <p className="text-[13px] text-faint">
                        {project.stack.join(" · ")}
                      </p>
                      {project.links && (
                        <p className="flex flex-wrap gap-x-4 text-[15px]">
                          {project.links.map((link) => (
                            <a
                              key={link.url}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
                            >
                              {link.label} ↗
                            </a>
                          ))}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      {finePointer && <ProjectPeek project={peekProject} />}
    </>
  );
}
