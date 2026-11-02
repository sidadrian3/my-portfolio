import { socialLinks } from "app/config";
import { getContributionCalendar } from "app/lib/github";
import { formatNumber } from "app/lib/format";
import { summarizeCalendar } from "app/lib/contributions";
import { ShippingPanel } from "./ShippingPanel";

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
      <ShippingPanel calendar={calendar} summary={summarizeCalendar(calendar)} />
      <p className="mt-3 text-sm text-faint">
        {formatNumber(calendar.total)} contributions in the last year ·{" "}
        <GithubLink>github ↗</GithubLink>
      </p>
    </div>
  );
}

export function ContributionGraphSkeleton() {
  return (
    <div aria-hidden>
      <div className="mb-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="py-1">
            <span className="block text-[28px] leading-tight">&nbsp;</span>
            <span className="block text-[13px]">&nbsp;</span>
            <span className="block text-[13px]">&nbsp;</span>
          </div>
        ))}
      </div>
      <div className="pb-1">
        <div className="h-[82px] w-full bg-hi sm:aspect-[686/105] sm:h-auto" />
      </div>
      <p className="mt-3 text-sm">&nbsp;</p>
    </div>
  );
}
