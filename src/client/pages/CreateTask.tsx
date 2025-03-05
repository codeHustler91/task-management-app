import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '../utils/trpc';
import { useQueryClient } from '@tanstack/react-query'

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  dueDate: z.string().optional(),
  // TODO retrieve userId from authentication
  userId: z.string().default('user123'),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function CreateTask() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      priority: 'MEDIUM',
      userId: 'user123', // Hardcoded for development
    },
  });

  const createTask = trpc.task.create.useMutation({
    onSuccess: (result) => {
      console.log("Task created successfully:", result);
      
      // Invalidate the query to refresh the task list
      queryClient.invalidateQueries({
        queryKey: ['task', 'getAll']
      });
      const previousTasks = queryClient.getQueryData(['task', 'getAll']) || [];
      if (Array.isArray(previousTasks)) {
        queryClient.setQueryData(['task', 'getAll'], [result, ...previousTasks]);
      }
      // Add a small delay before navigation to ensure invalidation completes
      setTimeout(() => navigate('/'), 100);
    },
    onError: (error) => {
      console.error("Error creating task:", error);
    }
  });

  const onSubmit = (data: TaskFormData) => {
    createTask.mutate(data);
  };

  return (
    <div className="create-task">
      <h2>Create New Task</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className={errors.title ? 'error' : ''}
          />
          {errors.title && <p className="error-text">{errors.title.message}</p>}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select id="priority" {...register('priority')}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            {...register('dueDate')}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}