import app from "./app.js";
import taskRoutes from "./routes/task.routes.js";




const PORT = process.env.PORT || 5000;

app.use("/api/tasks", taskRoutes);
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
