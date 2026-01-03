import { useEffect, useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import api from "../api/axios";
import { toast } from "react-toastify";
import { useTheme } from "../context/ThemeContext";
import Navbar from "../components/Navbar";

/* 🔴 REQUIRED: Chart.js registrations */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const Analytics = () => {
  const [tasks, setTasks] = useState([]);
  const { theme } = useTheme();

  /* ---------------- FETCH TASKS ---------------- */
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");

      // normalize status for analytics
      const normalized = (res.data || []).map((task) => ({
        ...task,
        status:
          task.status === "todo"
            ? "Todo"
            : task.status === "in_progress"
            ? "In Progress"
            : task.status === "completed"
            ? "Completed"
            : task.status,
      }));

      setTasks(normalized);
    } catch {
      toast.error("Failed to load analytics ❌");
    }
  };

  /* ---------------- SAFE DATA CALCULATION ---------------- */

  const statusCount = { Todo: 0, "In Progress": 0, Completed: 0 };
  const priorityCount = { Low: 0, Medium: 0, High: 0 };
  const completedByDate = {};

  tasks.forEach((task) => {
    if (statusCount[task.status] !== undefined) {
      statusCount[task.status]++;
    }

    if (priorityCount[task.priority] !== undefined) {
      priorityCount[task.priority]++;
    }

    if (task.status === "Completed" && task.created_at) {
      const date = task.created_at.split("T")[0];
      completedByDate[date] = (completedByDate[date] || 0) + 1;
    }
  });

  /* ---------------- COLORS ---------------- */

  const green = "#22c55e";
  const darkGreen = "#16a34a";
  const lightGreen = "#86efac";

  /* ---------------- CHART DATA ---------------- */

  const statusChart = {
    labels: Object.keys(statusCount),
    datasets: [
      {
        data: Object.values(statusCount),
        backgroundColor:
          theme === "dark"
            ? [green, darkGreen, lightGreen]
            : [green, "#4ade80", lightGreen],
        borderWidth: 1,
      },
    ],
  };

  const priorityChart = {
    labels: Object.keys(priorityCount),
    datasets: [
      {
        label: "Tasks",
        data: Object.values(priorityCount),
        backgroundColor: green,
      },
    ],
  };

  const lineChart = {
    labels: Object.keys(completedByDate),
    datasets: [
      {
        label: "Tasks Completed",
        data: Object.values(completedByDate),
        borderColor: green,
        backgroundColor: green,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const textColor = theme === "dark" ? "#22c55e" : "#065f46";

  const commonOptions = {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: textColor },
        grid: { display: false },
      },
      y: {
        ticks: { color: textColor },
        grid: { display: false },
      },
    },
  };

  /* ---------------- UI ---------------- */

  return (
    <div
      style={{
        backgroundColor: theme === "dark" ? "#000000" : "#ffffff",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <div className="container py-4">
        <h2 className="mb-4 text-center" style={{ color: textColor }}>
          Analytics Dashboard
        </h2>

        {tasks.length === 0 ? (
          <p className="text-center text-muted">
            No data available. Create tasks to see analytics 📊
          </p>
        ) : (
          <div className="row g-4">
            {/* PIE */}
            <div className="col-md-4">
              <div className="card shadow-sm p-3">
                <h6 className="text-center mb-3">Task Status</h6>
                <Pie data={statusChart} />
              </div>
            </div>

            {/* BAR */}
            <div className="col-md-4">
              <div className="card shadow-sm p-3">
                <h6 className="text-center mb-3">Tasks by Priority</h6>
                <Bar data={priorityChart} options={commonOptions} />
              </div>
            </div>

            {/* LINE */}
            <div className="col-md-4">
              <div className="card shadow-sm p-3">
                <h6 className="text-center mb-3">
                  Tasks Completed Over Time
                </h6>
                <Line data={lineChart} options={commonOptions} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
