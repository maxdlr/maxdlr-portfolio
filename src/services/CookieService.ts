import { CommitDate } from "./GithubService.ts";

type StoredDates = {
  lastFetched: string;
  dates: CommitDate[];
  badRepos: string[];
};

export class CookieService {
  public cookie: StoredDates;
  private storageKey = "maxdlr-portfolio-commit-dates";

  constructor() {
    if (localStorage.getItem(this.storageKey)) {
      this.cookie = JSON.parse(<string>localStorage.getItem(this.storageKey));
    } else {
      this.cookie = {} as StoredDates;
    }
  }

  public setCookie(dates: CommitDate[]) {
    const now = new Date();
    if (!this.cookie) this.cookie = {} as StoredDates;
    this.cookie.lastFetched = now.toJSON();
    this.cookie.dates = dates;
    localStorage.setItem(this.storageKey, JSON.stringify(this.cookie));
  }

  public isCookieDeprecated(): boolean {
    const now = new Date();
    const lastFetched: Date = new Date(this.cookie.lastFetched);
    return lastFetched.getMonth() !== now.getMonth();
  }
}
