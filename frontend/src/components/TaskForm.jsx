import { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const TaskForm = ({ onTaskCreated }) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    status: "todo",
    due_date: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/tasks", form);

      toast.success("Task created ✅");

      // normalize status for UI
      const normalizedTask = {
        ...res.data,
        status:
          res.data.status === "todo"
            ? "Todo"
            : res.data.status === "in_progress"
            ? "In Progress"
            : "Completed",
      };

      onTaskCreated(normalizedTask);

      // reset form
      setForm({
        title: "",
        description: "",
        priority: "Low",
        status: "todo",
        due_date: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create task ❌");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-3 shadow-sm">
      <h5>Create Task</h5>

      <div className="row g-3">
        <div className="col-md-4">
          <input
            className="form-control"
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="col-md-4">
          <input
            className="form-control"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="col-md-2">
          <select
            className="form-select"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-2">
          <button className="btn btn-success w-100">
            Add Task
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;
