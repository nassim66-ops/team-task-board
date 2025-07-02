import { useState, useEffect } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import { trpc } from '../utils/trpc';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Toaster } from './ui/sonner';
import { Search } from 'lucide-react';
import useKanbanBoard from '../hooks/useKanbanBoard';
import { KanbanColumn } from './KanbanColumn';
import EditTaskModal from './EditTaskModal';
import type { Status } from '../types/Types.t';



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

  const statuses = ['To Do', 'In Progress', 'Done'] as Status[];

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
        <div className="flex flex-row sm:flex-col gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"  style={{
          height: "16px",
        }} />
            <Input
              placeholder="Search tasks..."
              // className="pl-10"
               style={{
          paddingLeft: "40px",
          height: "36px",
          marginRight: "5px",
          color: "#000",
          fontSize: "16px",
        }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
<div className='flex flex-row sm:flex-col items-center justify-end'>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as Status | 'All')}
          >
            <SelectTrigger className="w-[180px]" style={{
              marginRight: "5px",
              color: '#000'
            }}>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem  value="All">All Statuses</SelectItem>
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
            <SelectTrigger className="w-[180px]" 
            style={{
              marginRight: "5px",
              color: '#000'
            }}>
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

          <Button  onClick={handleCreateTask}>Create Task</Button>
</div>
        </div>

      {/* Kanban Columns */}
      <div className="flex flex-wrap overflow-x-auto !p-4 gap-4" ref={parent}>
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
      <EditTaskModal
       editingTask={editingTask}
        formData={formData} 
        handleDelete={handleDelete}
         handleEditSubmit={handleEditSubmit}
         setEditingTask={setEditingTask}
         setFormData={setFormData}
         statuses={statuses}
         users={users}         
       />

      <Toaster position="top-right" />
    </div>
  );
};

