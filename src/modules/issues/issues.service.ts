import { title } from "process";
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
  const issue = result.rows[0];

  return {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
  };
};

const getAllIssuesFromDB = async (query: any) => {
  const { sort = "newest", type, status } = query;
  let sql = `SELECT * FROM issues`;
  const conditions: string[] = [];
  const values: string[] = [];
  if (type) {
    conditions.push(`type = $${values.length + 1}`);
    values.push(type as string);
  }
  if (status) {
    conditions.push(`status = $${values.length + 1}`);
    values.push(status as string);
  }
  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }
  if (sort === "oldest") {
    sql += ` ORDER BY created_at ASC`;
  } else {
    sql += ` ORDER BY created_at DESC`;
  }
  const issuesResult = await pool.query(sql, values);
  const issues = issuesResult.rows;

  const reporterIds = issues.map((issue) => issue.reporter_id);

  const uniqueIds = [...new Set(reporterIds)];

  const usersResult = await pool.query(
    `
      SELECT id, name, role
      FROM users
      WHERE id = ANY($1)
    `,
    [uniqueIds],
  );

  const formattedIssues = issues.map((issue) => {
    const reporter = usersResult.rows.find(
      (user) => user.id === issue.reporter_id,
    );

    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,

      reporter: {
        id: reporter?.id,
        name: reporter?.name,
        role: reporter?.role,
      },

      created_at: issue.created_at,
      updated_at: issue.updated_at,
    };
  });

  return formattedIssues;
};

const getSingleIssueFromDB = async (id: string) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1 `,
    [id],
  );
  const issue = issueResult.rows[0];
  if (!issue) return null;
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

const updateSingleIssueFromDB = async (payload: any, id: string, user: any) => {
  const issueResult = await pool.query(
    `
    SELECT * FROM issues WHERE id=$1`,
    [id],
  );
  if (issueResult.rows.length === 0) {
    throw new Error("Issue not found");
  }

  const issue = issueResult.rows[0];
  if (user.role === "contributor") {
    if (issue.reporter_id !== user.id) {
      throw new Error("You can update only your own issues");
    }
    if (issue.status !== "open") {
      throw new Error("You cannot update this issue");
    }
  }

  const { title, description, type } = payload;
  const result = await pool.query(
    `
    UPDATE issues SET 
    title=COALESCE($1,title),
    description=COALESCE($2,description),
    type=COALESCE($3,type),
    updated_at=NOW()
    WHERE id=$4
    RETURNING *`,
    [title, description, type, id],
  );
  return result.rows[0];
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
  getSingleIssueFromDB,
  updateSingleIssueFromDB,
};
