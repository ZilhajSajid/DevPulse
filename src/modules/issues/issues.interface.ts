export interface IIssues {
  title: string;
  description: string;
  type: string;
  reporter_id: number;
}
export interface IQueries {
  sort?: string;
  type?: string;
  status?: string;
}

export interface IUpdateIssue {
  title?: string;

  description?: string;

  type?: "bug" | "feature_request";

  status?: "open" | "in_progress" | "resolved";
}
