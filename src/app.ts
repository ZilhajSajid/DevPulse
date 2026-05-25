import express, {
  type Application,
  type Request,
  type Response,
} from "express";

import { issuesRoute } from "./modules/issues/issues.route";
import { authRoute } from "./modules/auth/auth.route";
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "DevPulse Server",
    author: "Md Zilhaj Un Noor",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/auth", authRoute);
app.use("/api/issues", issuesRoute);
app.use("/api/issues", issuesRoute);
export default app;
