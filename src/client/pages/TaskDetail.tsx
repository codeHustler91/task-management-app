import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { trpc } from '../utils/trpc';

export function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use tRPC to fetch a single task
  const taskQuery = trpc.task.getById.useQuery({ id: id || '' });
  
  // Use tRPC mutations for updating and deleting
  const updateTask = trpc.task.update.useMutation({
    onSuccess: () => {
      taskQuery.refetch();
    },
  });
  
  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: () => {
      navigate('/');
    },
  });

  // Handle status changes
  const handleStatusChange = (newStatus: 'TODO' | 'IN_PROGRESS' | 'DONE') => {
    if (id) {
      updateTask.mutate({
        id,
        status: newStatus,
      });
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (id && window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate({ id });
    }
  };

  if (taskQuery.isLoading) {
    return <div>Loading task...</div>;
  }

  if (taskQuery.error) {
    return <div>Error loading task: {taskQuery.error.message}</div>;
  }

  const task = taskQuery.data;

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="task-detail">
      <h2>{task.title}</h2>
      <div className="task-properties">
        <div className="property">
          <label>Status:</label>
          <div className="status-buttons">
            <button
              className={`status-button ${task.status === 'TODO' ? 'active' : ''}`}
              onClick={() => handleStatusChange('TODO')}
            >
              To Do
            </button>
            <button
              className={`status-button ${task.status === 'IN_PROGRESS' ? 'active' : ''}`}
              onClick={() => handleStatusChange('IN_PROGRESS')}
            >
              In Progress
            </button>
            <button
              className={`status-button ${task.status === 'DONE' ? 'active' : ''}`}
              onClick={() => handleStatusChange('DONE')}
            >
              Done
            </button>
          </div>
        </div>
        <div className="property">
          <label>Priority:</label>
          <span>{task.priority}</span>
        </div>
        {task.dueDate && (
          <div className="property">
            <label>Due Date:</label>
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
        {task.description && (
          <div className="property description">
            <label>Description:</label>
            <p>{task.description}</p>
          </div>
        )}
      </div>
      <div className="task-actions">
        <button className="delete-button" onClick={handleDelete}>
          Delete Task
        </button>
      </div>
    </div>
  );
}