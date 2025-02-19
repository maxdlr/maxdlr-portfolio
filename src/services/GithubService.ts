import { Octokit } from "octokit";

export interface CommitDate {
  day: number;
  month: number;
  year: number;
}

export class GithubService {
  private octokit: Octokit;

  constructor() {
    this.octokit = new Octokit({
      auth: import.meta.env.VITE_GITHUB_API_TOKEN,
    });
  }

  public async getAllCommitDates() {
    const repoNameIterator = this.octokit.paginate.iterator(
      this.octokit.rest.repos.listForAuthenticatedUser,
      {
        accept: "application/vnd.github+json",
        username: "maxdlr",
        per_page: 100,
      },
    );

    const dates: CommitDate[] = [];

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
}
