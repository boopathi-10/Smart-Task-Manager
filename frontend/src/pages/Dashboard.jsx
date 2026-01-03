import { useEffect, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import api from "../api/axios";
import { toast } from "react-toastify";

import TaskForm from "../components/TaskForm";
import TaskColumn from "../components/TaskColumn";
import FilterBar from "../components/FilterBar";
import Navbar from "../components/Navbar";



const Dashboard = () => {
  /* -------------------- STATE -------------------- */
  const [tasks, setTasks] = useState([]);
  const [dragDisabled, setDragDisabled] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sortBy: "created_at",
    order: "desc",
  });

  /* -------------------- FETCH TASKS -------------------- */
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");

      const normalizedTasks = (res.data || []).map((task) => ({
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

      setTasks(normalizedTasks);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load tasks ❌");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);


  useEffect(() => {
  const mappedFilters = {
    ...filters,
    status:
      filters.status === "Todo"
        ? "todo"
        : filters.status === "In Progress"
        ? "in_progress"
        : filters.status === "Completed"
        ? "completed"
        : "",
  };

  const query = new URLSearchParams(mappedFilters).toString();

  const fetchFilteredTasks = async () => {
    try {
      const res = await api.get(`/tasks?${query}`);

      const normalized = (res.data || []).map((task) => ({
        ...task,
        status:
          task.status === "todo"
            ? "Todo"
            : task.status === "in_progress"
            ? "In Progress"
            : "Completed",
      }));

      setTasks(normalized);
    } catch {
      toast.error("Failed to apply filters ❌");
    }
  };

  fetchFilteredTasks();
}, [filters]);


  /* -------------------- CREATE TASK -------------------- */
  const handleTaskCreated = (newTask) => {
    const normalized = {
      ...newTask,
      status:
        newTask.status === "todo"
          ? "Todo"
          : newTask.status === "in_progress"
          ? "In Progress"
          : "Completed",
    };
    setTasks((prev) => [normalized, ...prev]);
  };


  const handleTaskUpdated = (updatedTask) => {
  setTasks((prev) =>
    prev.map((task) =>
      task.id === updatedTask.id
        ? {
            ...updatedTask,
            status:
              updatedTask.status === "todo"
                ? "Todo"
                : updatedTask.status === "in_progress"
                ? "In Progress"
                : "Completed",
          }
        : task
    )
  );
};

const handleTaskDeleted = (id) => {
  setTasks((prev) => prev.filter((task) => task.id !== id));
};


  /* -------------------- DRAG & DROP -------------------- */
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const updatedTasks = [...tasks];
    const index = updatedTasks.findIndex(
      (t) => t.id.toString() === draggableId
    );

    if (index === -1) return;

    const task = updatedTasks[index];

    const updatedTask = {
      ...task,
      status:
        destination.droppableId === "Todo"
          ? "todo"
          : destination.droppableId === "In Progress"
          ? "in_progress"
          : "completed",
    };

    updatedTasks[index] = {
      ...updatedTask,
      status:
        updatedTask.status === "todo"
          ? "Todo"
          : updatedTask.status === "in_progress"
          ? "In Progress"
          : "Completed",
    };

    setTasks(updatedTasks);

    try {
      await api.put(`/tasks/${task.id}`, updatedTask);
      toast.success("Task status updated 🔄");
    } catch {
      toast.error("Failed to update task ❌");
      fetchTasks();
    }
  };

  /* -------------------- FILTER BY STATUS -------------------- */
  const todoTasks = tasks.filter((t) => t.status === "Todo");
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress");
  const completedTasks = tasks.filter((t) => t.status === "Completed");

  /* -------------------- UI -------------------- */
  return (
    <div className="container-fluid px-4">
      <Navbar />

      <div className="mt-4">
        <FilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="mt-3">
        <TaskForm onTaskCreated={handleTaskCreated} />
      </div>

      {tasks.length === 0 && (
        <p className="text-center text-muted mt-4">
          No tasks yet. Create one to get started 🚀
        </p>
      )}

<DragDropContext
  onDragEnd={dragDisabled ? () => {} : onDragEnd}
>
        <div className="row mt-4">
          <div className="col-lg-4 col-md-6 mb-3">
            {/* <TaskColumn title="Todo" droppableId="Todo" tasks={todoTasks} /> */}
            <TaskColumn
                title="Todo"
                droppableId="Todo"
                tasks={todoTasks}
                onTaskUpdated={handleTaskUpdated}
                onTaskDeleted={handleTaskDeleted}
                setDraggingDisabled={setDragDisabled}
              />

          </div>

          <div className="col-lg-4 col-md-6 mb-3">
            {/* <TaskColumn
              title="In Progress"
              droppableId="In Progress"
              tasks={inProgressTasks}
            /> */}
            <TaskColumn
              title="In Progress"
              droppableId="In Progress"
              tasks={inProgressTasks}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              setDraggingDisabled={setDragDisabled}
            />

          </div>

          <div className="col-lg-4 col-md-12 mb-3">
            {/* <TaskColumn
              title="Completed"
              droppableId="Completed"
              tasks={completedTasks}
            /> */}

            <TaskColumn
              title="Completed"
              droppableId="Completed"
              tasks={completedTasks}
              onTaskUpdated={handleTaskUpdated}
              onTaskDeleted={handleTaskDeleted}
              setDraggingDisabled={setDragDisabled}
            />

          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
