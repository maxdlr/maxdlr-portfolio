import { Octokit } from "octokit";
import { Utils } from "../composables/Utils.ts";

export interface CommitDate {
  day: number;
  month: number;
  year: number;
}

export type ColorStep =
  | 0
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 950;

export interface CommitDateWithIntensity extends CommitDate {
  intensity: ColorStep;
}

type StoredDates = { lastFetched: string; dates: CommitDate[] };

export class GithubService {
  private octokit: Octokit;
  private storageKey = "maxdlr-portfolio-commit-dates";

  constructor() {
    this.octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_API_TOKEN,
    });
  }

  public async getAllCommitDates(force: boolean = false) {
    const now = new Date();
    const dates: CommitDate[] = [];
    const stored: StoredDates = JSON.parse(
      <string>localStorage.getItem(this.storageKey),
    );

    if (localStorage.getItem(this.storageKey)) {
      const lastFetched: Date = new Date(stored.lastFetched);
      const isTooSoon = lastFetched.getMonth() === now.getMonth();

      if (isTooSoon && !force) {
        console.log(stored.dates.length);
        return stored.dates;
      }
    }

    await this.logIn();

    const repoNameIterator = this.octokit.paginate.iterator(
      this.octokit.rest.repos.listForAuthenticatedUser,
      {
        accept: "application/vnd.github+json",
        username: "maxdlr",
        per_page: 100,
      },
    );

    for await (const { data: repos } of repoNameIterator) {
      for (const repo of repos) {
        try {
          const commitDates: CommitDate[] = [];
          const commits = await this.getAllCommitsByRepo(repo.name);

          commits.forEach((commit) => {
            commitDates.push(this.getCommitDate(commit));
          });

          dates.push(...commitDates);
        } catch {}
      }
    }

    const storage: StoredDates = {
      lastFetched: now.toJSON(),
      dates: dates,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(storage));

    return dates;
  }

  public async getAllCommitsByRepo(repo: string): Promise<{}[]> {
    const iterator = this.octokit.paginate.iterator(
      this.octokit.rest.repos.listCommits,
      {
        accept: "application/vnd.github+json",
        owner: "maxdlr",
        author: "maxdlr",
        committer: "maxdlr",
        repo: repo,
        per_page: 100,
        since: "2024-01-01",
      },
    );
    const result = [];
    for await (const { data: commits } of iterator) {
      for (const commit of commits) {
        result.push(commit);
      }
    }
    return result;
  }

  public async logIn() {
    await this.octokit.rest.users.getAuthenticated();
    return this;
  }

  public calculateDateIntensity(
    dates: CommitDate[],
  ): CommitDateWithIntensity[] {
    // Group dates by their day/month/year combination
    let groupedDates = dates.reduce(
      (acc, date) => {
        const key = `${date.day}-${date.month}-${date.year}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(date);
        return acc;
      },
      {} as Record<string, CommitDate[]>,
    );

    groupedDates = this.addMissingDaysToMonth(groupedDates);
    const sortedGroupedDates = {} as Record<string, CommitDate[]>;

    const sortedKeys: string[] = Object.keys(groupedDates).sort(
      (a: string, b: string) => {
        const aMonth = Utils.explodeDateKey(a).month ?? 0;
        const bMonth = Utils.explodeDateKey(b).month ?? 0;
        return aMonth - bMonth;
      },
    );

    sortedKeys.forEach((key: string) => {
      sortedGroupedDates[key] = groupedDates[key];
    });

    // Calculate frequencies
    const frequencies = Object.values(sortedGroupedDates).map(
      (group) => group.length,
    );

    const minFreq: number = Math.min(...frequencies);
    const maxFreq: number = Math.max(...frequencies);

    const intensitySteps: ColorStep[] = [
      0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950,
    ];

    return Object.entries(groupedDates).map(
      (value: [string, CommitDate[]], index: number) => {
        let intensity: ColorStep;
        const frequency: number = frequencies[index];

        if (minFreq === maxFreq) {
          intensity = 500;
        } else {
          // Calculate normalized value between 0 and 1
          const normalized =
            ((frequency - minFreq) / (maxFreq - minFreq) + 0.09) * 1.3;

          // Convert to index in our intensity steps array
          // Multiply by (steps.length - 1) to get full range from 0 to 10
          const stepIndex = Math.round(
            normalized * (intensitySteps.length + 1),
          );

          // Get the corresponding intensity value
          intensity = intensitySteps[stepIndex];
        }

        // console.log(intensity);

        return {
          day: value[1][0].day,
          month: value[1][0].month,
          year: value[1][0].year,
          intensity,
        };
      },
    );
  }

  private getCommitDate(commit): CommitDate {
    const date: Date = new Date(commit.commit.committer.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return { day, month, year };
  }

  private addMissingDaysToMonth(
    dates: Record<string, CommitDate[]>,
  ): Record<string, CommitDate[]> {
    const keys = Object.keys(dates);
    const sortedByMonth: number[][] = [];
    const missingDaysByMonth: number[][] = [];
    const smallMonths: number[] = [4, 6, 9, 11];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const matchedMonth: number | null = Utils.explodeDateKey(key).month;

      if (matchedMonth) {
        for (let x = 1; x <= 31; x++) {
          if (matchedMonth === x) {
            if (!sortedByMonth[x]) sortedByMonth[x] = [];
            const day = key.match(/(\d+)/);
            if (day) sortedByMonth[x].push(parseInt(day.toString()));
          }
        }
      }
    }

    for (let i = 1; i <= 31; i++) {
      sortedByMonth.forEach((month: number[], index: number) => {
        if (!month.includes(i)) {
          if (!missingDaysByMonth[index]) missingDaysByMonth[index] = [];
          if (smallMonths.includes(index) && i === 31) return;
          if ([30, 31].includes(i) && index === 2) return;
          missingDaysByMonth[index].push(i);
        }
      });
    }

    missingDaysByMonth.forEach((days: number[], index: number) => {
      days.forEach((day: number) => {
        const key = `${day}-${index}-2024`;
        if (!dates[key])
          dates[key] = [
            {
              day,
              month: index,
              year: 2024,
            },
          ];
      });
    });

    return dates;
  }
}
