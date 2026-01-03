import { pool } from "../config/db.js";

/* CREATE TASK */
export const createTask = async (req, res) => {
  const { title, description, priority, status, due_date } = req.body;

  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, priority, status, due_date)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [req.user.id, title, description, priority, status, due_date]
  );

  res.status(201).json(result.rows[0]);
};

/* READ TASKS */
export const getTasks = async (req, res) => {
  try {
    console.log("🔥 getTasks HIT");
    console.log("User:", req.user);
    console.log("Query:", req.query);

    const {
      search = "",
      status = "",
      priority = "",
      sortBy = "created_at",
      order = "desc",
      page = 1,
      limit = 5,
    } = req.query;

    let baseQuery = `SELECT * FROM tasks WHERE user_id = $1`;
    let values = [req.user.id];
    let idx = 2;

    // Search
    if (search.trim() !== "") {
      baseQuery += ` AND title ILIKE $${idx}`;
      values.push(`%${search}%`);
      idx++;
    }

    // Filter by status
    if (status.trim() !== "") {
      baseQuery += ` AND status = $${idx}`;
      values.push(status);
      idx++;
    }

    // Filter by priority
    if (priority.trim() !== "") {
      baseQuery += ` AND priority = $${idx}`;
      values.push(priority);
      idx++;
    }

    // Sorting
    const allowedSort = ["due_date", "priority", "created_at"];
    const sortField = allowedSort.includes(sortBy)
      ? sortBy
      : "created_at";
    const sortOrder = order.toLowerCase() === "asc" ? "ASC" : "DESC";

    baseQuery += ` ORDER BY ${sortField} ${sortOrder}`;

    // Pagination
    const offset = (Number(page) - 1) * Number(limit);
    baseQuery += ` LIMIT $${idx} OFFSET $${idx + 1}`;
    values.push(limit, offset);

    // 🔥 IMPORTANT: result is declared BEFORE use
    const result = await pool.query(baseQuery, values);

    console.log("✅ TASK COUNT:", result.rows.length);

    res.json(result.rows);
  } catch (error) {
    console.error("❌ getTasks error:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};




/* UPDATE TASK */
export const updateTask = async (req, res) => {
  console.log("------------update api called---------");

  const { id } = req.params;
  const { title, description, priority, status, due_date } = req.body;
  console.log( title, description, priority, status, due_date );

  const result = await pool.query(
    `UPDATE tasks
     SET title=$1, description=$2, priority=$3, status=$4, due_date=$5
     WHERE id=$6 AND user_id=$7
     RETURNING *`,
    [title, description, priority, status, due_date, id, req.user.id]
  );

  if (!result.rows.length)
    return res.status(404).json({ error: "Task not found" });

  res.json(result.rows[0]);
};

/* DELETE TASK */
export const deleteTask = async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    "DELETE FROM tasks WHERE id=$1 AND user_id=$2 RETURNING *",
    [id, req.user.id]
  );

  if (!result.rows.length)
    return res.status(404).json({ error: "Task not found" });

  res.json({ message: "Task deleted successfully" });
};

