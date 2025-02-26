import { Octokit } from "octokit";
import { ContributionsProcessor } from "../composables/processors/ContributionsProcessor.ts";
import { CookieService } from "./CookieService.ts";
import { GhCommit, GhEvent, GhRepo } from "../interface/Github.ts";

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

export class GithubService {
  private octokit: Octokit;
  private cookieService: CookieService;
  private contributionProcessor: ContributionsProcessor;
  public username: string = "maxdlr";
  private header: { accept: string } = {
    accept: "application/vnd.github+json",
  };

  constructor() {
    this.octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_API_TOKEN,
    });
    this.contributionProcessor = new ContributionsProcessor();
    this.cookieService = new CookieService();
  }

  public async logIn() {
    await this.octokit.rest.users.getAuthenticated();
    return this;
  }

  public async getAllContributions(
    force: boolean = false,
  ): Promise<CommitDateWithIntensity[]> {
    let dates: CommitDateWithIntensity[] = [];
    if (!this.cookieService.isCookieDeprecated() && !force) {
      dates = this.cookieService.cookie.dates;
    } else {
      await this.logIn();
      await Promise.all([this.getAllCommits(), this.getEvents()]).then(
        (result) => {
          const commitDates = result[0]?.map((commit: GhCommit) =>
            this.contributionProcessor.getCommitDate(commit),
          );
          const eventDates = result[1]?.map((event: GhEvent) =>
            this.contributionProcessor.getEventDate(event),
          );
          [commitDates, eventDates].forEach((part) => dates.push(...part));
        },
      );
    }

    this.cookieService.setCookie(dates);
    dates = this.contributionProcessor.calculateDateIntensity(dates);
    dates = this.contributionProcessor.sortDates(dates);

    return dates;
  }

  public async getEvents(): Promise<GhEvent[]> {
    const fetchedEvents: GhEvent[] = await this.iterateFetch(
      this.getEventsForAuthenticatedUserIterator(),
    );
    const fetchedReceivedEvents = await this.iterateFetch(
      this.getReceivedEventsForAuthenticatedUserIterator(),
    );

    return [...fetchedEvents, ...fetchedReceivedEvents];
  }

  public async getAllCommits(): Promise<GhCommit[]> {
    let fetchedCommits: GhCommit[] = [];

    await this.iterateFetch(
      this.getReposForAuthenticatedUserIterator(),
      async (repo: GhRepo) => {
        const repoName = repo.name;
        if (
          !this.cookieService.cookie.badRepos ||
          !this.cookieService.cookie.badRepos.includes(repoName)
        ) {
          try {
            fetchedCommits.push(...(await this.getAllCommitsByRepo(repoName)));
          } catch {
            this.cookieService.cookie.badRepos.push(repo.name);
          }
        }
      },
    );

    return fetchedCommits;
  }

  public async getAllCommitsByRepo(repo: string): Promise<GhCommit[]> {
    return this.iterateFetch(this.getCommitsByRepoIterator(repo));
  }

  private async iterateFetch(
    iterator: AsyncIterable<any>,
    action?: (item: any) => void,
  ) {
    const result = [];
    for await (const { data } of iterator) {
      for (const item of data) {
        action ? action(item) : result.push(item);
      }
    }
    return result;
  }

  private getEventsForAuthenticatedUserIterator() {
    return this.octokit.paginate.iterator(
      this.octokit.rest.activity.listEventsForAuthenticatedUser,
      {
        accept: this.header.accept,
        username: this.username,
        all: true,
        per_page: 100,
      },
    );
  }

  private getReceivedEventsForAuthenticatedUserIterator() {
    return this.octokit.paginate.iterator(
      this.octokit.rest.activity.listReceivedEventsForUser,
      {
        accept: this.header.accept,
        username: this.username,
        all: true,
        per_page: 100,
      },
    );
  }

  private getCommitsByRepoIterator(repositoryName: string) {
    return this.octokit.paginate.iterator(this.octokit.rest.repos.listCommits, {
      accept: this.header.accept,
      owner: this.username,
      author: this.username,
      committer: this.username,
      repo: repositoryName,
      per_page: 100,
    });
  }

  private getReposForAuthenticatedUserIterator() {
    return this.octokit.paginate.iterator(
      this.octokit.rest.repos.listForAuthenticatedUser,
      {
        accept: this.header.accept,
        username: this.username,
        per_page: 100,
      },
    );
  }
}
