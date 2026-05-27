import type { JwtPayload } from "jsonwebtoken";
import type { IAuthUser } from "../modules/auth/auth.interface";

declare global {
  namespace Express {
    interface Request {
      user: IAuthUser;
    }
  }
}
