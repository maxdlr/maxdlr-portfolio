import { Octokit } from "octokit";
import { Utils } from "../composables/Utils.ts";

export interface CommitDate {
  id?: number;
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
  intensity?: ColorStep;
}

type StoredDates = {
  lastFetched: string;
  dates: CommitDate[];
  badRepos: string[];
};

export class GithubService {
  private octokit: Octokit;
  private storageKey = "maxdlr-portfolio-commit-dates";
  private cookie: StoredDates;
  private years = [2023, 2024, 2025];

  constructor() {
    this.octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_API_TOKEN,
    });
    if (localStorage.getItem(this.storageKey)) {
      this.cookie = JSON.parse(<string>localStorage.getItem(this.storageKey));
    } else {
      this.cookie = {} as StoredDates;
    }
  }

  public async GetAllActivityDatesWithIntensity(
    force: boolean = false,
  ): Promise<CommitDateWithIntensity[]> {
    let dates: CommitDateWithIntensity[] = [];
    if (!this.isCookieDeprecated() && !force) {
      dates = this.cookie.dates;
    } else {
      await Promise.all([this.getAllCommitDates(), this.getEventDates()]).then(
        (result) => result.forEach((part) => dates.push(...part)),
      );
    }

    this.setCookie(dates);

    dates = this.calculateDateIntensity(dates);

    dates = dates.sort((a: CommitDate, b: CommitDate) => {
      return a.day - b.day;
    });
    dates = dates.sort((a: CommitDate, b: CommitDate) => {
      return a.month - b.month;
    });
    dates = dates.sort((a: CommitDate, b: CommitDate) => {
      return a.year - b.year;
    });

    console.log(dates);

    dates.forEach((date: CommitDate, index: number) => {
      date.id = index;
    });

    return dates;
  }

  public async getEventDates(): Promise<CommitDate[]> {
    await this.logIn();
    const eventIterator = this.octokit.paginate.iterator(
      this.octokit.rest.activity.listEventsForAuthenticatedUser,
      {
        accept: "application/vnd.github+json",
        username: "maxdlr",
        all: true,
        per_page: 100,
      },
    );

    const fetchedEvents = [];
    for await (const { data: events } of eventIterator) {
      for (const event of events) {
        fetchedEvents.push(this.getEventDate(event, 0));
      }
    }

    const eventReceivedIterator = this.octokit.paginate.iterator(
      this.octokit.rest.activity.listReceivedEventsForUser,
      {
        accept: "application/vnd.github+json",
        username: "maxdlr",
        all: true,
        per_page: 100,
      },
    );

    const fetchedReceivedEvents = [];
    for await (const { data: events } of eventReceivedIterator) {
      for (const event of events) {
        fetchedReceivedEvents.push(this.getEventDate(event, 0));
      }
    }

    return fetchedEvents;
  }

  private getEventDate(event, id: number): CommitDate {
    const date: Date = new Date(event.created_at);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return { id, day, month, year };
  }

  private isCookieDeprecated(): boolean {
    const now = new Date();
    const lastFetched: Date = new Date(this.cookie.lastFetched);
    return lastFetched.getMonth() !== now.getMonth();
  }

  public async getAllCommitDates() {
    const dates: CommitDate[] = [];
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
        const repoName = repo.name;

        if (!this.cookie.badRepos.includes(repoName)) {
          try {
            const commitDates: CommitDate[] = [];
            const commits = await this.getAllCommitsByRepo(repoName);

            commits.forEach((commit) => {
              commitDates.push(this.getCommitDate(commit));
            });

            dates.push(...commitDates);
          } catch {
            this.cookie.badRepos.push(repo.name);
          }
        }
      }
    }

    return dates;
  }

  private setCookie(dates: CommitDate[]) {
    const now = new Date();
    if (!this.cookie) this.cookie = {} as StoredDates;
    this.cookie.lastFetched = now.toJSON();
    this.cookie.dates = dates;
    localStorage.setItem(this.storageKey, JSON.stringify(this.cookie));
  }

  public async getAllCommitsByRepo(repo: string): Promise<{}[]> {
    try {
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
          until: "2024-12-01",
        },
      );
      const result = [];
      for await (const { data: commits } of iterator) {
        for (const commit of commits) {
          result.push(commit);
        }
      }
      return result;
    } catch {
      throw new Error(`Could not get all commits from ${repo}`);
    }
  }

  public async logIn() {
    await this.octokit.rest.users.getAuthenticated();
    return this;
  }

  public calculateDateIntensity(
    dates: CommitDate[],
  ): CommitDateWithIntensity[] {
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

    const frequencies = Object.values(groupedDates).map(
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
          const normalized =
            ((frequency - minFreq) / (maxFreq - minFreq) + 0.09) * 1.3;

          const stepIndex = Math.round(
            normalized * (intensitySteps.length + 1),
          );

          intensity = intensitySteps[stepIndex];
        }

        if (/-1-/.test(value[0])) console.log(value[0], value[1][0]);

        return {
          id: 0,
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
    const sortedByMonth: number[][][] = [];
    const missingDaysByMonth: number[][][] = [];
    const smallMonths: number[] = [4, 6, 9, 11];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const matchedMonth: number | null = Utils.explodeDateKey(key).month;
      const matchedYear: number | null = Utils.explodeDateKey(key).year;

      this.years.forEach((year: number) => {
        if (matchedMonth) {
          for (let x = 1; x <= 12; x++) {
            if (matchedMonth === x && matchedYear === year) {
              if (!sortedByMonth[year]) sortedByMonth[year] = [];
              if (!sortedByMonth[year][x]) sortedByMonth[year][x] = [];
              const day = key.match(/(\d+)/);
              if (day) sortedByMonth[year][x].push(parseInt(day[0].toString()));
            }
          }
        }
      });

      this.years.forEach((year: number) => {
        sortedByMonth.forEach(
          (daysByMonthByYear: number[][], yearIndex: number) => {
            daysByMonthByYear.forEach(
              (daysByMonth: number[], monthIndex: number) => {
                for (let i = 1; i <= 31; i++) {
                  if (!daysByMonth.includes(i) && yearIndex === year) {
                    if (!missingDaysByMonth[yearIndex]) {
                      missingDaysByMonth[yearIndex] = [];
                    }
                    if (!missingDaysByMonth[yearIndex][monthIndex]) {
                      missingDaysByMonth[yearIndex][monthIndex] = [];
                    }
                    if (smallMonths.includes(monthIndex) && i === 31) return;
                    if ([30, 31].includes(i) && monthIndex === 2) return;
                    missingDaysByMonth[yearIndex][monthIndex].push(i);
                  }
                }
              },
            );
          },
        );
      });

      this.years.forEach((year: number) => {
        missingDaysByMonth.forEach(
          (daysByMonthByYear: number[][], yearIndex: number) => {
            daysByMonthByYear.forEach(
              (daysByMonth: number[], monthIndex: number) => {
                for (let i = 1; i <= 31; i++) {
                  const key = `${i}-${monthIndex}-${year}`;
                  if (
                    !daysByMonth.includes(i) &&
                    yearIndex === year &&
                    !dates[key]
                  ) {
                    daysByMonth.forEach((day: number) => {
                      dates[key] = [
                        {
                          id: 0,
                          day: day,
                          month: monthIndex,
                          year: yearIndex,
                        },
                      ];
                    });
                  }
                }
              },
            );
          },
        );
      });
    }
    return dates;
  }
}
