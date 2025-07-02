import { useDrag } from "react-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { Task, User } from "../types/Types.t";

export const TaskCard = ({ task, onEdit, users }: { task: Task; onEdit: (task: Task) => void; users: User[] }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const assignee = users.find((user) => user.id === task.assignee_id);
  const defaultUrl = 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'

  return (
    <div
      ref={drag}
      className={`cursor-grab active:cursor-grabbing  ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => onEdit(task)}
      style={{
        paddingTop: '8px'
      }}
    >
      <Card className="hover:shadow-md transition-shadow" style={{
        border: 'none'
      }}>
        <CardHeader className="p-4 pb-2" style={{
        paddingBottom: '8px',
        padding: "16px",
      }}>
          <CardTitle className="text-lg flex justify-between items-start">
            <span className="line-clamp-1">{task.title}</span>
            {/* <Badge variant="outline" className="text-xs capitalize">
              {task.status.toLowerCase()}
            </Badge> */}
          </CardTitle>
           {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 " style={{
        margin: '0px'
      }}>
              {task.description}
            </p>
          )}
          <span className="text-muted-foreground" style={{
        marginTop: '10px'
      }}>
              {task.created_at && new Date(task.created_at).toLocaleDateString()}
            </span>
        </CardHeader>
        <CardContent className="p-4 pt-0" style={{
        paddingTop: '0px'
      }}>
         
          <div className="flex justify-between items-center text-xs">
            
            {assignee && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={assignee.avatar_url || defaultUrl} />
                  <AvatarFallback>{assignee.name?.[0] || assignee.email?.[0]}</AvatarFallback>
                </Avatar>
                <span className="text-muted-foreground">
                  {assignee.name || assignee.email.split('@')[0]}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};