export interface GhCommit {
  commit: { committer: { date: string } };
}

export interface GhEvent {
  created_at: string;
}

export interface GhRepo {
  name: string;
}

export interface GhOrg {
  organization: {
    login: string;
  };
}

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
