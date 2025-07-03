import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import type { Status, Task, User } from '../types/Types.t';


interface EditTaskModalProps {
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  handleEditSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formData: Partial<Task>;
  setFormData: (data: Partial<Task>) => void;
  users: User[];
  statuses: Status[];
  handleDelete: () => Promise<void>;
}

const EditTaskModal = (props: EditTaskModalProps) => {
    const {editingTask, setEditingTask, handleEditSubmit,formData , setFormData, users, statuses, handleDelete} = props;
  return (
   <Dialog open={!!editingTask}   onOpenChange={(open) => !open && setEditingTask(null)}>
        <DialogContent className="sm:max-w-[600px] w-1/2 [&>:last-child]:hidden "  style={{
          margin: "5px",
          padding: "15px",
          borderWidth: "1px",
          borderColor: "#d1d5db",
        }}>
          <DialogHeader>
            <DialogTitle style={{
              color: '#000'
            }}>Edit Task "{editingTask?.title}" </DialogTitle>
            <DialogDescription>
              {editingTask?.created_at && `Created on ${new Date(editingTask.created_at).toLocaleDateString()}`}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title" style={{
                color: "#000",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
                marginTop: "12px",
              }}>Title *</Label>
              <Input
                id="title"
                style={{
              borderColor: "#d1d5db",
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "6px",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
                value={formData.title ?? ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description" style={{
                color: "#000",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
                marginTop: "12px",
              }}>Description</Label>
              <Textarea
                id="description"
                style={{
              borderColor: "#d1d5db",
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: "6px",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
                value={formData.description ?? ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>

            <div className="flex flex-wrap gap-4" style={{
              gap: "16px",
              marginTop: "8px"
            }}>
              <div>
                <Label htmlFor="status"style={{
                color: "#000",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
                marginTop: "12px",
              }}>Status *</Label>
                <Select
                  value={formData.status ?? 'To Do'}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Status })}
                >
                  <SelectTrigger style={{
              marginRight: "5px",
              color: '#000'
            }}>
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
                <Label htmlFor="assignee"style={{
                color: "#000",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "8px",
                marginTop: "12px",
              }}>Assignee</Label>
                <Select
                  value={formData.assignee_id ?? ''}
                  onValueChange={(value) => setFormData({ ...formData, assignee_id: value })}
                >
                  <SelectTrigger style={{
              marginRight: "5px",
              color: '#000'
            }}>
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

            <div className="flex flex-wrap justify-between" style={{
              gap: "12px",
              marginTop: "18px",
            }}>
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
              <div className="space-x-2 flex flex-wrap" style={{
              gap: "12px",
            }}>
                <Button
                  type="button"
                  variant="secondary"
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
  )
}

export default EditTaskModal
