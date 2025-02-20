import { Octokit } from "octokit";

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
    let dates: CommitDate[] = [];
    const stored: StoredDates = JSON.parse(
      <string>localStorage.getItem(this.storageKey),
    );

    if (localStorage.getItem(this.storageKey)) {
      const lastFetched: Date = new Date(stored.lastFetched);
      const isTooSoon = lastFetched.getMonth() === now.getMonth();

      if (isTooSoon && !force) {
        return stored.dates;
      }
    }

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
          console.log(repo.name);
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

  private getCommitDate(commit: {}): CommitDate {
    const date: Date = new Date(commit.commit.author.date);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return { day, month, year };
  }

  public async getAllCommitsByRepo(repo: string): Promise<{}[]> {
    const iterator = this.octokit.paginate.iterator(
      this.octokit.rest.repos.listCommits,
      {
        accept: "application/vnd.github+json",
        owner: "maxdlr",
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
    const groupedDates = dates.reduce(
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

    // Calculate frequencies
    const frequencies = Object.values(groupedDates).map(
      (group) => group.length,
    );
    console.log(frequencies);
    const minFreq = Math.min(...frequencies);
    const maxFreq = Math.max(...frequencies);

    return Object.entries(groupedDates).map(
      (value: [string, CommitDate[]], index: number) => {
        let intensity: CommitDateWithIntensity["intensity"];
        const frequency = frequencies[index];
        console.log(frequency);

        if (frequency === maxFreq) {
          intensity = 950;
        } else if (frequency === minFreq) {
          intensity = 100;
        } else {
          // Calculate intermediate intensity
          const step = Math.floor(
            ((frequency - minFreq) / (maxFreq - minFreq)) * 5,
          );
          console.log(step);
          intensity = (step * 100) as CommitDateWithIntensity["intensity"];
        }

        return {
          day: value[1][0].day,
          month: value[1][0].month,
          year: value[1][0].year,
          intensity,
        };
      },
    );
  }
}
