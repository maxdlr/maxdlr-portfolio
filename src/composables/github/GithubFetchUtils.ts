import { GithubCommit } from "./GithubFetchTypes.ts";

const getDateOfCommit = (commit: GithubCommit): Date => {
  return new Date(commit.commit.committer.date);
};

export { getDateOfCommit };
