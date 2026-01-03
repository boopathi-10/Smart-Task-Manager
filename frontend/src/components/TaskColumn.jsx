import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskItem from "./TaskItem";

const TaskColumn = ({
  title,
  droppableId,
  tasks,
  onTaskUpdated,
  onTaskDeleted,
  setDraggingDisabled = () => {}, // 🛡️ SAFE DEFAULT
}) => {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header fw-bold text-center">
        {title}
      </div>

      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="p-3"
            style={{ minHeight: "200px" }}
          >
            {tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={task.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="mb-3"
                  >
                    <TaskItem
                      task={task}
                      onTaskUpdated={onTaskUpdated}
                      onTaskDeleted={onTaskDeleted}
                      setDraggingDisabled={setDraggingDisabled}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {tasks.length === 0 && (
              <p className="text-muted text-center small">
                No tasks here
              </p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
