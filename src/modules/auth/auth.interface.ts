export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
}

export interface ILoginPayload {
  email: string;
  password: string;
}
