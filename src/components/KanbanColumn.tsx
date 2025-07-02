import { useDrop } from "react-dnd";
import { Badge } from "./ui/badge";
import { TaskCard } from "./TaskCard";
import type { Status, Task, User } from "../types/Types.t";

export const KanbanColumn = ({
  status,
  tasks,
  onTaskDrop,
  onEditTask,
  users,
}: {
  status: Status;
  tasks: Task[];
  onTaskDrop: (taskId: string, newStatus: Status) => void;
  onEditTask: (task: Task) => void;
  users: User[];
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item: { id: string }) => onTaskDrop(item.id, status),
    collect: (monitor: { isOver: () => boolean; }) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <div
      ref={drop}
      style={{
          margin: "5px",
          borderColor: "#d1d5db",
        }}
      className={`flex-1 min-w-[300px] rounded-lg p-4 transition-colors border !border-gray-300 ${
        isOver ? 'bg-gray-100' : 'bg-gray-50'
      }`}
    >
      <div className="flex justify-between gap-5 items-center sticky top-0 bg-white/80 backdrop-blur-sm p-2 rounded  " style={{
          paddingRight: "8px",
          paddingLeft: "8px",
        }} >
        <h2 className="font-semibold text-lg " style={{
          color: "#000"
        }}>{status}</h2>
        <Badge className="!text-red-900 p-2" style={{
          paddingTop: "2px",
          border: "none",
          paddingLeft: "10px",
          color: ""
        }} variant="outline">{columnTasks.length}</Badge>
      </div>
      <div className="space-y-3 mt-4">
        {columnTasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} users={users} />
        ))}
      </div>
    </div>
  );
};