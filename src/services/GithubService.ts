import { Octokit } from "octokit";
import { ContributionsProcessor } from "../composables/processors/ContributionsProcessor.ts";
import { CookieService } from "./CookieService.ts";
import {
  CommitDateWithIntensity,
  GhCommit,
  GhEvent,
  GhOrg,
  GhRepo,
} from "../interface/Github.ts";

export class GithubService {
  public username: string = "maxdlr";
  private octokit: Octokit;
  private cookieService: CookieService;
  private contributionProcessor: ContributionsProcessor;
  private header: { accept: string } = {
    accept: "application/vnd.github+json",
  };
  private excludeRepoList: string[] = ["old"];

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
      await Promise.all([
        this.getAllOwnerCommits(),
        this.getAllOrgCommits(),
        this.getEvents(),
      ]).then((result) => {
        const ownerCommitDates = result[0]?.map((commit: GhCommit) =>
          this.contributionProcessor.getCommitDate(commit),
        );

        const orgCommitDates = result[1]?.map((commit: GhCommit) =>
          this.contributionProcessor.getCommitDate(commit),
        );

        const eventDates = result[2]?.map((event: GhEvent) =>
          this.contributionProcessor.getEventDate(event),
        );
        [ownerCommitDates, orgCommitDates, eventDates].forEach((part) =>
          dates.push(...part),
        );
      });
    }

    this.cookieService.setCookie({
      dates,
    });

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

  public async getAllOwnerCommits(): Promise<GhCommit[]> {
    const fetchedCommits: GhCommit[] = [];

    await this.iterateFetch(
      this.getReposForAuthenticatedUserIterator(),
      async (repo: GhRepo) => {
        const repoName = repo.name;
        if (
          !this.cookieService.cookie?.badRepos?.includes(repoName) &&
          !this.excludeRepoList.includes(repoName)
        ) {
          try {
            fetchedCommits.push(...(await this.getAllCommitsByRepo(repoName)));
          } catch {
            this.cookieService.cookie.badRepos.push(repoName);
          }
        }
      },
    );

    return fetchedCommits;
  }

  public async getAllCommitsByRepo(
    repo: string,
    owner: string = this.username,
  ): Promise<GhCommit[]> {
    return this.iterateFetch(this.getCommitsByRepoIterator(repo, owner));
  }

  private async getAllOrgCommits(): Promise<GhCommit[]> {
    const fetchedCommits: GhCommit[] = [];
    const orgs: GhOrg[] = await this.getOrgsForAuthenticatedUser();
    const orgNames: string[] = orgs.map((org: GhOrg) => org.organization.login);

    const orgRepos: Record<string, GhRepo[]> = {};
    for (const org of orgNames) {
      if (!orgRepos[org]) orgRepos[org] = [];
      const repos = await this.iterateFetch(this.getReposForOrgIterator(org));
      if (repos.length > 0) orgRepos[org].push(...repos);
    }

    for (const value of Object.entries(orgRepos)) {
      const org = value[0];
      const repos: string[] = value[1].map((repo: GhRepo) => repo.name);

      for (const repo of repos) {
        fetchedCommits.push(
          ...(await this.iterateFetch(
            this.getCommitsByRepoIterator(repo, org),
          )),
        );
      }
    }
    return fetchedCommits;
  }

  private async getOrgsForAuthenticatedUser(): Promise<GhOrg[]> {
    const response =
      await this.octokit.rest.orgs.listMembershipsForAuthenticatedUser({
        accept: this.header.accept,
        username: this.username,
        per_page: 100,
        affiliation: "owner",
      });

    return response.data;
  }

  private async iterateFetch(
    iterator: AsyncIterable<any>,
    action?: (item: any) => void,
  ) {
    const result = [];
    for await (const fetched of iterator) {
      for (const item of fetched.data) {
        action ? action(item) : result.push(item);
      }
    }
    return result;
  }

  private getReposForOrgIterator(orgName: string) {
    return this.handleErrors(() =>
      this.octokit.paginate.iterator(this.octokit.rest.repos.listForOrg, {
        accept: this.header.accept,
        org: orgName,
        per_page: 100,
      }),
    );
  }

  private getEventsForAuthenticatedUserIterator() {
    return this.handleErrors(() =>
      this.octokit.paginate.iterator(
        this.octokit.rest.activity.listEventsForAuthenticatedUser,
        {
          accept: this.header.accept,
          username: this.username,
          all: true,
          per_page: 100,
        },
      ),
    );
  }

  private getReceivedEventsForAuthenticatedUserIterator() {
    return this.handleErrors(() =>
      this.octokit.paginate.iterator(
        this.octokit.rest.activity.listReceivedEventsForUser,
        {
          accept: this.header.accept,
          username: this.username,
          all: true,
          per_page: 100,
        },
      ),
    );
  }

  private getCommitsByRepoIterator(
    repositoryName: string,
    owner: string = this.username,
  ) {
    return this.handleErrors(() =>
      this.octokit.paginate.iterator(this.octokit.rest.repos.listCommits, {
        accept: this.header.accept,
        owner,
        author: this.username,
        committer: this.username,
        repo: repositoryName,
        per_page: 100,
      }),
    );
  }

  private getReposForAuthenticatedUserIterator() {
    return this.handleErrors(() =>
      this.octokit.paginate.iterator(
        this.octokit.rest.repos.listForAuthenticatedUser,
        {
          accept: this.header.accept,
          username: this.username,
          per_page: 100,
          affiliation: "owner",
        },
      ),
    );
  }

  private handleErrors(iterator: () => AsyncIterable<any>): AsyncIterable<any> {
    try {
      return iterator();
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw error;
      }
    }
  }
}
