import { useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { toast } from 'sonner';
import { trpc } from '../utils/trpc';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Toaster } from './ui/sonner';
import { Search } from 'lucide-react';
import useKanbanBoard from '../hooks/useKanbanBoard';


type Status = 'To Do' | 'In Progress' | 'Done';

export const KanbanBoard = () => {
  // State management
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('All');
  const [parent] = useAutoAnimate();

  // Data fetching
  const { data: tasks = [], refetch } = trpc.task.getAll.useQuery();
  const { data: users = [] } = trpc.user.getAll.useQuery();
 const { 
  filteredTasks,
  handleDelete,
   handleEditSubmit,
   handleTaskDrop,
   handleCreateTask,
   editingTask,
   setEditingTask
  } = useKanbanBoard(trpc, tasks, searchTerm, statusFilter, assigneeFilter, refetch,  formData);

  const statuses = ['To Do', 'In Progress', 'Done'];

  // Real-time updates (simulated)
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 15000); // Refresh every 15 seconds

    return () => clearInterval(interval);
  }, [refetch]);

  return (
    <div className="flex flex-col h-full">
      {/* Header with search and filters */}
      <div className="p-4 border-b flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Team Task Board</h1>
        
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as Status | 'All')}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Assignee Filter */}
          <Select
            value={assigneeFilter}
            onValueChange={(value) => setAssigneeFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Assignees</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={handleCreateTask}>Create Task</Button>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex flex-1 overflow-x-auto p-4 gap-4" ref={parent}>
        {statuses.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={filteredTasks}
            onTaskDrop={handleTaskDrop}
            onEditTask={(task) => {
              setEditingTask(task);
              setFormData({
                title: task.title,
                description: task.description,
                status: task.status,
                assignee_id: task.assignee_id,
              });
            }}
            users={users}
          />
        ))}
      </div>

      {/* Task Edit Modal */}
      <Dialog open={!!editingTask} onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              {editingTask?.created_at && `Created on ${new Date(editingTask.created_at).toLocaleDateString()}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title ?? ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description ?? ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status ?? 'To Do'}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Status })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="assignee">Assignee</Label>
                <Select
                  value={formData.assignee_id ?? ''}
                  onValueChange={(value) => setFormData({ ...formData, assignee_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Unassigned" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unassigned">Unassigned</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={user.avatar_url} />
                            <AvatarFallback>{user.name?.[0] || user.email?.[0]}</AvatarFallback>
                          </Avatar>
                          {user.name || user.email}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  toast.promise(handleDelete(), {
                    loading: 'Deleting task...',
                    success: 'Task deleted!',
                    error: 'Failed to delete task'
                  });
                }}
              >
                Delete Task
              </Button>
              <div className="space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Toaster position="top-right" />
    </div>
  );
};

// Kanban Column Component
const KanbanColumn = ({
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
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[300px] rounded-lg p-4 transition-colors ${
        isOver ? 'bg-gray-100' : 'bg-gray-50'
      }`}
    >
      <div className="flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-sm p-2 rounded">
        <h2 className="font-semibold text-lg">{status}</h2>
        <Badge variant="outline">{columnTasks.length}</Badge>
      </div>
      <div className="space-y-3 mt-4">
        {columnTasks.map((task) => (
          <TaskCard key={task.id} task={task} onEdit={onEditTask} users={users} />
        ))}
      </div>
    </div>
  );
};

// Task Card Component
const TaskCard = ({ task, onEdit, users }: { task: Task; onEdit: (task: Task) => void; users: User[] }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TASK',
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const assignee = users.find((user) => user.id === task.assignee_id);

  return (
    <div
      ref={drag}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      onClick={() => onEdit(task)}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-lg flex justify-between items-start">
            <span className="line-clamp-1">{task.title}</span>
            <Badge variant="outline" className="text-xs capitalize">
              {task.status.toLowerCase()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {task.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {task.description}
            </p>
          )}
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">
              {task.created_at && new Date(task.created_at).toLocaleDateString()}
            </span>
            {assignee && (
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={assignee.avatar_url} />
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