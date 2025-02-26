import { Octokit } from "octokit";
import { ContributionsProcessor } from "../composables/processors/ContributionsProcessor.ts";

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
  private contributionProcessor: ContributionsProcessor;

  constructor() {
    this.octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_API_TOKEN,
    });

    if (localStorage.getItem(this.storageKey)) {
      this.cookie = JSON.parse(<string>localStorage.getItem(this.storageKey));
    } else {
      this.cookie = {} as StoredDates;
    }
    this.contributionProcessor = new ContributionsProcessor();
  }

  public async logIn() {
    await this.octokit.rest.users.getAuthenticated();
    return this;
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

    return dates;
  }

  public async getEventDates(): Promise<CommitDate[]> {
    await this.logIn();
    const eventIterator = this.getEventsForAuthenticatedUserIterator();

    const fetchedEvents = [];
    for await (const { data: events } of eventIterator) {
      for (const event of events) {
        fetchedEvents.push(this.contributionProcessor.getEventDate(event, 0));
      }
    }

    const eventReceivedIterator =
      this.getReceivedEventsForAuthenticatedUserIterator();

    const fetchedReceivedEvents = [];
    for await (const { data: events } of eventReceivedIterator) {
      for (const event of events) {
        fetchedReceivedEvents.push(
          this.contributionProcessor.getEventDate(event, 0),
        );
      }
    }

    return fetchedEvents;
  }

  public async getAllCommitDates() {
    const dates = [];
    await this.logIn();

    const repoNameIterator = this.getReposForAuthenticatedUserIterator();

    for await (const { data: repos } of repoNameIterator) {
      for (const repo of repos) {
        const repoName = repo.name;

        if (!this.cookie.badRepos.includes(repoName)) {
          try {
            const commitDates: CommitDate[] = [];
            const commits = await this.getAllCommitsByRepo(repoName);

            commits.forEach((commit) => {
              commitDates.push(
                this.contributionProcessor.getCommitDate(commit),
              );
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

  public async getAllCommitsByRepo(repo: string): Promise<{}[]> {
    try {
      const iterator = this.getCommitsByRepoIterator(repo);
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

  private getEventsForAuthenticatedUserIterator() {
    return this.octokit.paginate.iterator(
      this.octokit.rest.activity.listEventsForAuthenticatedUser,
      {
        accept: "application/vnd.github+json",
        username: "maxdlr",
        all: true,
        per_page: 100,
      },
    );
  }

  private getReceivedEventsForAuthenticatedUserIterator() {
    return this.octokit.paginate.iterator(
      this.octokit.rest.activity.listReceivedEventsForUser,
      {
        accept: "application/vnd.github+json",
        username: "maxdlr",
        all: true,
        per_page: 100,
      },
    );
  }

  private getCommitsByRepoIterator(repositoryName: string) {
    return this.octokit.paginate.iterator(this.octokit.rest.repos.listCommits, {
      accept: "application/vnd.github+json",
      owner: "maxdlr",
      author: "maxdlr",
      committer: "maxdlr",
      repo: repositoryName,
      per_page: 100,
    });
  }

  private getReposForAuthenticatedUserIterator() {
    return this.octokit.paginate.iterator(
      this.octokit.rest.repos.listForAuthenticatedUser,
      {
        accept: "application/vnd.github+json",
        username: "maxdlr",
        per_page: 100,
      },
    );
  }

  private setCookie(dates: CommitDate[]) {
    const now = new Date();
    if (!this.cookie) this.cookie = {} as StoredDates;
    this.cookie.lastFetched = now.toJSON();
    this.cookie.dates = dates;
    localStorage.setItem(this.storageKey, JSON.stringify(this.cookie));
  }

  private isCookieDeprecated(): boolean {
    const now = new Date();
    const lastFetched: Date = new Date(this.cookie.lastFetched);
    return lastFetched.getMonth() !== now.getMonth();
  }
}
