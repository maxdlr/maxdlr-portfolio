import { CommitDate } from "../interface/Github.ts";

type StoredDates = {
  lastFetched: Date | string;
  dates: CommitDate[];
  badRepos: string[];
};

export class CookieService {
  public cookie: StoredDates = {} as StoredDates;
  private storageKey = "maxdlr-portfolio-commit-dates";

  constructor() {
    if (localStorage.getItem(this.storageKey)) {
      this.cookie = JSON.parse(<string>localStorage.getItem(this.storageKey));
    } else {
      this.setCookie();
    }
    if (typeof this.cookie.lastFetched === "string")
      this.cookie.lastFetched = new Date(this.cookie.lastFetched);
  }

  public setCookie(cookie?: { dates?: CommitDate[]; badRepos?: string[] }) {
    const now = new Date();
    if (cookie) {
      if (cookie.badRepos) this.cookie.badRepos = cookie.badRepos;
      if (cookie.dates) this.cookie.dates = cookie.dates;
    }
    this.cookie.lastFetched = now;
    localStorage.setItem(this.storageKey, JSON.stringify(this.cookie));
  }

  public isCookieDeprecated(): boolean {
    const now = new Date();
    const lastFetched: Date = this.cookie.lastFetched as Date;
    const timeDifference = now.getTime() - lastFetched.getTime();
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return daysDifference >= 7;
  }
}
