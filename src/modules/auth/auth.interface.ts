export interface IUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
