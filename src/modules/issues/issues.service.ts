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
  const result = await pool.query(`
    SELECT * FROM issues`);
  return result;
};

export const issuesService = {
  createIssuesIntoDB,
  getAllIssuesFromDB,
};
