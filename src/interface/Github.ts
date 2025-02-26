export interface GhCommit {
  commit: { committer: { date: string } };
}

export interface GhEvent {
  created_at: string;
}

export interface GhRepo {
  name: string;
}
