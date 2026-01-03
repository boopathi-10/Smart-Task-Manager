import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const TaskItem = ({
  task,
  onTaskUpdated,
  onTaskDeleted,
  setDraggingDisabled = () => {}, // 🛡️ SAFE DEFAULT
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    due_date: task.due_date || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* -------------------- UPDATE -------------------- */
  const handleUpdate = async () => {
    try {
      const payload = {
        title: form.title,
        description: form.description,
        priority: form.priority,
        due_date: form.due_date,
        status:
          task.status === "Todo"
            ? "todo"
            : task.status === "In Progress"
            ? "in_progress"
            : "completed",
      };

      const res = await api.put(`/tasks/${task.id}`, payload);

      toast.success("Task updated ✏️");
      onTaskUpdated(res.data);

      setIsEditing(false);
      setDraggingDisabled(false);
    } catch (err) {
      console.error(err);
      toast.error("Update failed ❌");
    }
  };

  /* -------------------- DELETE -------------------- */
  const handleDelete = async () => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`/tasks/${task.id}`);
      toast.success("Task deleted 🗑️");
      onTaskDeleted(task.id);
    } catch {
      toast.error("Delete failed ❌");
    }
  };

  return (
    <div className="card p-3 shadow-sm">
      {isEditing ? (
        <>
          <input
            className="form-control mb-2"
            name="title"
            value={form.title}
            onChange={handleChange}
          />

          <input
            className="form-control mb-2"
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <select
            className="form-select mb-2"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <input
            type="date"
            className="form-control mb-3"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />

          <div className="d-flex gap-2">
            <button
              className="btn btn-success btn-sm"
              onClick={handleUpdate}
            >
              Save
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setIsEditing(false);
                setDraggingDisabled(false);
              }}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h6 className="fw-bold">{task.title}</h6>
          <p className="text-muted mb-1">{task.description}</p>
          <small className="text-muted">
            Priority: {task.priority}
          </small>

          <div className="d-flex justify-content-end gap-2 mt-2">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => {
                setIsEditing(true);
                setDraggingDisabled(true);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
