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
import { NowLine } from "./components/NowLine";
import { RevealOnce } from "./components/RevealOnce";

export default function Page() {
  return (
    <div className="flex w-full flex-col">
      <Hero />

      <Section label="Now" className="[animation:none]">
        <RevealOnce>
          <NowLine pieces={metaData.now} updated={metaData.nowUpdated} />
        </RevealOnce>
      </Section>

      <Section label="Projects" id="projects" className="[animation:none]">
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
