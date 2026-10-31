import { Suspense } from "react";
import { metaData } from "./config";
import { projects } from "./lib/content/projects";
import { Hero } from "./components/Hero";
import { Section } from "./components/Section";
import { ProjectList } from "./components/projects/ProjectList";
import {
  ContributionGraph,
  ContributionGraphSkeleton,
} from "./components/ContributionGraph";
import { OnRepeat } from "./components/OnRepeat";

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <Hero />

      <Section label="Now">
        <p className="text-[15px] text-mute">{metaData.now}</p>
      </Section>

      <Section label="Projects" id="projects">
        <ProjectList projects={projects} />
      </Section>

      <Section label="Shipping" stacked>
        <Suspense fallback={<ContributionGraphSkeleton />}>
          <ContributionGraph login="sidadrian3" />
        </Suspense>
      </Section>

      <Section label="On repeat">
        <OnRepeat />
      </Section>
    </div>
  );
}
