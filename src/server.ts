import app from "./app";
import config from "./config";
import { initIssuesDB, initUsersDB } from "./db";

const main = () => {
  initUsersDB();
  initIssuesDB();
  app.listen(config.port, () => {
    console.log(`DevPulse app listening on port ${config.port}`);
  });
};
main();
