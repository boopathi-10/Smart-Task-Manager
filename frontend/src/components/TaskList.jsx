import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onUpdate, onDelete }) => {
  if (!tasks.length) return <p>No tasks yet.</p>;

  return (
    <div>
      <h3>Your Tasks</h3>

      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
