import { pool } from "../../db";

const createIssuesIntoDB = async (payload: any) => {
  const { title, description, type, reporter_id } = payload;
  // 1 First check user exists
  const user = await pool.query(
    `
    SELECT * FROM users WHERE id=$1`,
    [reporter_id],
  );
  if (user.rows.length === 0) {
    throw new Error("User Not Exists!");
  }
  const result = await pool.query(
    `INSERT INTO issues(title, description, type, reporter_id) VALUES($1,$2,$3,$4) RETURNING *`,
    [title, description, type, reporter_id],
  );
  return result;
};

const getAllIssuesFromDB = async () => {
  const issuesResult = await pool.query(`
    SELECT * FROM issues`);
  const issue = issuesResult.rows[0];

  const reporterResult = await pool.query(
    `
    SELECT id,name,role FROM users WHERE id=$1`,
    [issue.reporter_id],
  );
  const reporter = reporterResult.rows[0];
  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: {
      id: reporter.id,
      name: reporter.name,
      role: reporter.role,
    },
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1 `,
    [id],
  );
  const issue = issueResult.rows[0];

  const reporterResult = await pool.query(
    `
  SELECT id,name,role FROM users WHERE id=$1`,
    [issue.reporter_id],
  );
  const reporter = reporterResult.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,

    reporter: {
      id: reporter.id,
      name: reporter.name,
      role: reporter.role,
    },

    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
};
