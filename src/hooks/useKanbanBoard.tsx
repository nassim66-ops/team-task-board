import React, { useState } from 'react'
import { toast } from 'sonner';

const useKanbanBoard = (trpc, tasks, searchTerm, statusFilter, assigneeFilter, refetch,  formData) => {
 const updateTask = trpc.task.update.useMutation();
  const deleteTask = trpc.task.delete.useMutation();
  const createTask = trpc.task.create.useMutation();
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  const [editingTask, setEditingTask] = useState<Task | null>(null);
    
  // Filter tasks based on search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = searchTerm === '' || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    
    const matchesAssignee = assigneeFilter === 'All' || task.assignee_id === assigneeFilter;
    
    const matchesDate = !dateRange.start || !dateRange.end || (
      new Date(task.created_at) >= dateRange.start && 
      new Date(task.created_at) <= dateRange.end
    );
    
    return matchesSearch && matchesStatus && matchesAssignee && matchesDate;
  });

  // Task drag and drop
  const handleTaskDrop = async (taskId: string, newStatus: Status) => {
    try {
      await updateTask.mutateAsync({ id: taskId, status: newStatus });
      refetch();
      toast.success('Task moved successfully');
    } catch (error) {
      toast.error('Failed to move task');
    }
  };

  // Task CRUD operations
  const handleCreateTask = async () => {
    try {
      await createTask.mutateAsync({
        title: 'New Task',
        status: 'To Do',
      });
      refetch();
      toast.success('Task created successfully');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;

    try {
      await updateTask.mutateAsync({
        id: editingTask.id,
        title: formData.title,
        description: formData.description || '',
        // assignee_id: formData.assignee_id || '', TODO: To add it after we add the profiles
        status: formData.status,
      }); 
      refetch();
      setEditingTask(null);
      toast.success('Task updated successfully');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async () => {
    if (!editingTask) return;

    try {
      await deleteTask.mutateAsync(editingTask.id);
      refetch();
      setEditingTask(null);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };


  return { 
    filteredTasks,
    handleDelete,
     handleEditSubmit,
     handleTaskDrop,
     handleCreateTask,
     editingTask,
     setEditingTask
    };
}

export default useKanbanBoard
