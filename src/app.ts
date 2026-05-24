import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { userRoute } from "./modules/user/user.routes";
import { issuesRoute } from "./modules/issues/issues.route";
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse Server",
    author: "Md Zilhaj Un Noor",
  });
});

app.use("/api/auth/signup", userRoute);
app.use("/api/issues", issuesRoute);
app.use("/api/issues", issuesRoute);
export default app;
