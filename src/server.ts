import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
import config from "./config";
const app: Application = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
  connectionString: config.connection_string,
});

const initDB = async () => {
  try {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(40),
        email VARCHAR(40) UNIQUE NOT NULL,
        password VARCHAR(30) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )`);
    // console.log("Table created");
  } catch (error) {
    console.log(error);
  }
};
initDB();

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Express Server",
    author: "Md Zilhaj Un Noor",
  });
});

app.post("/api/users", async (req: Request, res: Response) => {
  //   console.log(req.body);
  const { name, email, password, role } = req.body;
  try {
    const result = await pool.query(
      `
    INSERT INTO users (name,email,password,role) VALUES($1,$2,$3,$4)
    RETURNING *`,
      [name, email, password, role],
    );

    res.status(201).json({
      success: true,
      message: "User Created Successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
    SELECT * FROM users`);
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "No Users Found!",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "Users Retrieved Successfully!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

app.get("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT * FROM users WHERE id=$1
        `,
      [id],
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "User Retrieved Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
});

app.put("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, password, role } = req.body;
  try {
    const result = await pool.query(
      `
        UPDATE users SET 
        name=COALESCE($1,name),
        password=COALESCE($2,password),
        role=COALESCE($3,role)
        WHERE id=$4 RETURNING *`,
      [name, password, role, id],
    );
    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found",
        data: {},
      });
    }
    res.status(200).json({
      success: true,
      message: "User Updated Successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      data: error,
    });
  }
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
        DELETE FROM users WHERE id=$1 RETURNING *`,
      [id],
    );
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "User Not Found!",
        data: result.rows[0],
      });
    }
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
      data: {},
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
