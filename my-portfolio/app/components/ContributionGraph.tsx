import { socialLinks } from "app/config";
import { getContributionCalendar, type ContributionCalendar } from "app/lib/github";

const CELL = 10;
const GAP = 3;
const STEP = CELL + GAP;
const DAYS_IN_WEEK = 7;
const GRAPH_HEIGHT = DAYS_IN_WEEK * STEP - GAP;

const numberFormat = new Intl.NumberFormat("en-US");

const dateFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function describeDay(count: number, date: string) {
  const noun = count === 1 ? "contribution" : "contributions";
  return `${count} ${noun} on ${dateFormat.format(new Date(`${date}T00:00:00Z`))}`;
}

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

export function ContributionGraphView({ calendar }: { calendar: ContributionCalendar }) {
  const width = calendar.weeks.length * STEP - GAP;
  const total = numberFormat.format(calendar.total);

  return (
    <div>
      <div dir="rtl" className="overflow-x-auto pb-1">
        <div dir="ltr" className="w-full min-w-[480px]">
          <svg
            role="img"
            aria-label={`${total} contributions in the last year`}
            viewBox={`0 0 ${width} ${GRAPH_HEIGHT}`}
            className="block h-auto w-full"
          >
            {calendar.weeks.map((week, w) =>
              week.days.map((day, d) => (
                <rect
                  key={day.date}
                  x={w * STEP}
                  y={d * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={`rgb(var(--contrib-${day.level}))`}
                >
                  <title>{describeDay(day.count, day.date)}</title>
                </rect>
              )),
            )}
          </svg>
        </div>
      </div>
      <p className="mt-3 text-sm text-faint">
        {total} contributions in the last year · <GithubLink>github ↗</GithubLink>
      </p>
    </div>
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

  return <ContributionGraphView calendar={calendar} />;
}

export function ContributionGraphSkeleton() {
  return (
    <div aria-hidden>
      <div className="pb-1">
        <div className="h-16 w-full bg-hi sm:aspect-[686/91] sm:h-auto" />
      </div>
      <p className="mt-3 text-sm">&nbsp;</p>
    </div>
  );
}
