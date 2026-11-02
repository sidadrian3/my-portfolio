import Image from "next/image";
import type { Project } from "app/lib/content/projects";

function posterBackground(project: Project) {
  return `linear-gradient(145deg, ${project.tint}, #0d0d0d)`;
}

function PosterBody({ project }: { project: Project }) {
  return (
    <>
      {project.image ? (
        <Image
          src={project.image}
          alt=""
          fill
          sizes="220px"
          className="object-cover"
        />
      ) : (
        <div
          className="flex h-full flex-col justify-between p-[6.4%] text-[#F5F0E8]"
          style={{ backgroundImage: posterBackground(project) }}
        >
          <p className="font-mono text-[min(4.5cqw,10px)] opacity-75">
            {project.kind} · {project.year}
          </p>
          <div>
            <p className="text-[min(8.64cqw,19px)] font-bold leading-tight">
              {project.title}
            </p>
            <p className="mt-1 text-[min(4.5cqw,10px)] opacity-75">
              {project.stack.join(" · ")}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export function ProjectPoster({
  project,
  framed = false,
}: {
  project: Project;
  framed?: boolean;
}) {
  return (
    <div className="relative flex aspect-[220/136] w-full flex-col overflow-hidden rounded-[4px] bg-[#0d0d0d] text-[#F5F0E8] [container-type:inline-size]">
      {framed && (
        <div
          className="flex h-[14px] shrink-0 items-center gap-[3px] bg-[#161616] px-[5px]"
          aria-hidden="true"
        >
          <span className="size-[4px] rounded-full bg-[#F5F0E8]/30" />
          <span className="size-[4px] rounded-full bg-[#F5F0E8]/30" />
          <span className="size-[4px] rounded-full bg-[#F5F0E8]/30" />
        </div>
      )}
      <div className="relative min-h-0 flex-1">
        <PosterBody project={project} />
      </div>
    </div>
  );
}
