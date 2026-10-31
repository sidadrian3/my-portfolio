import { socialLinks } from "app/config";
import { getContributionCalendar } from "app/lib/github";
import { ContributionGrid } from "./ContributionGrid";

const numberFormat = new Intl.NumberFormat("en-US");

function GithubLink({ children }: { children: React.ReactNode }) {
  return (
    <a
      href={socialLinks.github}
      target="_blank"
      rel="noopener noreferrer"
      className="underline-offset-4 hover:text-ink hover:underline"
    >
      {children}
    </a>
  );
}

export async function ContributionGraph({ login }: { login: string }) {
  const calendar = await getContributionCalendar(login);

  if (!calendar) {
    return (
      <p className="text-sm text-faint">
        my contributions live on <GithubLink>github ↗</GithubLink>
      </p>
    );
  }

  return (
    <div>
      <ContributionGrid calendar={calendar} />
      <p className="mt-3 text-sm text-faint">
        {numberFormat.format(calendar.total)} contributions in the last year ·{" "}
        <GithubLink>github ↗</GithubLink>
      </p>
    </div>
  );
}

export function ContributionGraphSkeleton() {
  return (
    <div aria-hidden>
      <div className="pb-1">
        <div className="h-[74px] w-full bg-hi sm:aspect-[686/91] sm:h-auto" />
      </div>
      <p className="mt-3 text-sm">&nbsp;</p>
    </div>
  );
}
