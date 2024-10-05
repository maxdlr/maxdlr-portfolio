export type GithubCommit = {
  author: {};
  commit: {
    author: {};
    comment_count: number;
    committer: {
      date: string;
      email: string;
      name: string;
    };
    messages: string;
    tree: {};
    url: string;
    verification: {};
  };
  commiter: {};
  html_urk: string;
  node_id: string;
  parents: {}[];
  sha: string;
  url: string;
};
