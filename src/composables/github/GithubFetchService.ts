import { Octokit } from "octokit";
import { GithubCommit } from "./GithubFetchTypes.ts";
import { OctokitResponse } from "@octokit/types";

const octokit = new Octokit({
  auth: import.meta.env.GITHUB_TOKEN,
});

const getRepos = async () => {
  const response: OctokitResponse<any> = await octokit
    .request("GET /user/repos", {})
    .catch((err) => {
      if (err.status >= 400) {
        return null;
      }
    });

  return response.data;
};

const getOrganizations = async () => {
  const response: OctokitResponse<any> = await octokit.request(
    "GET /users/maxdlr/orgs",
    {},
  );

  return response.data;
};

const getCommitsFromRepo = async (repoName, options: {} = {}) => {
  try {
    let response = await octokit
      .request(`GET /repos/maxdlr/${repoName}/commits`, options)
      .catch((err) => {
        if (err.status >= 400) {
          return null;
        }
      });

    return response.data ?? null;
  } catch (response) {
    return null;
  }
};

const getAllCommitsFromRepo = async (repoName: string) => {
  const commits: GithubCommit[] = [];
  let currentFetchedCount: number = 0;
  let i: number = 1;

  const fetch = async () =>
    await getCommitsFromRepo(repoName, { per_page: 100, page: i }).then(
      (fetched) => {
        if (fetched) {
          currentFetchedCount = fetched.length;
          commits.push(...fetched);
          i++;
        }
      },
    );

  await fetch();
  while (currentFetchedCount === 100) {
    await fetch();
  }
  console.info(`${commits.length} commits from ${repoName}`);
  return commits;
};

const getOneRepo = async (repoName) => {
  let response = await octokit.request(`GET /repos/maxdlr/${repoName}`);
  return response.data ?? null;
};

export {
  getRepos,
  getCommitsFromRepo,
  getOneRepo,
  getAllCommitsFromRepo,
  getOrganizations,
};
