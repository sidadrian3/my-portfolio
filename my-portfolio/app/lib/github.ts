export type ContributionDay = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
export type ContributionCalendar = { total: number; weeks: { days: ContributionDay[] }[] };

const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const QUERY = `
  query ($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

const LEVELS: Record<string, ContributionDay["level"]> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

type RawCalendar = {
  totalContributions: number;
  weeks: {
    contributionDays: { date: string; contributionCount: number; contributionLevel: string }[];
  }[];
};

type GraphQLResponse = {
  data?: {
    user?: { contributionsCollection?: { contributionCalendar?: RawCalendar } } | null;
  };
};

export async function getContributionCalendar(login: string): Promise<ContributionCalendar | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: "POST",
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login } }),
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const payload = (await response.json()) as GraphQLResponse;
    const raw = payload.data?.user?.contributionsCollection?.contributionCalendar;
    if (!raw) return null;

    return {
      total: raw.totalContributions,
      weeks: raw.weeks.map((week) => ({
        days: week.contributionDays.map((day) => ({
          date: day.date,
          count: day.contributionCount,
          level: LEVELS[day.contributionLevel] ?? 0,
        })),
      })),
    };
  } catch {
    return null;
  }
}
