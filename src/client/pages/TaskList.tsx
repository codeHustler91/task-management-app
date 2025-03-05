import React from 'react';
import { Link } from 'react-router-dom';
import { trpc } from '../utils/trpc';

export function TaskList() {
  // Use tRPC to fetch all tasks
  const tasksQuery = trpc.task.getAll.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
    refetchOnReconnect: true,
    // onSuccess: (data) => {
    //   console.log("Tasks fetched successfully:", data.length, "tasks");
    // }
  });
  console.log("TaskList rendering, isFetching:", tasksQuery.isFetching);

  if (tasksQuery.isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (tasksQuery.error) {
    return <div>Error loading tasks: {tasksQuery.error.message}</div>;
  }

  const tasks = tasksQuery.data || [];

  return (
    <div className="tasks-container">
      <h2>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks yet. Create your first task!</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <div className={`task-status ${task.status.toLowerCase()}`} />
              <div className="task-details">
                <h3>
                  <Link to={`/task/${task.id}`}>{task.title}</Link>
                </h3>
                <p className="task-priority">Priority: {task.priority}</p>
                {task.dueDate && (
                  <p className="task-date">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="task-actions">
        <Link to="/create" className="create-button">
          Create New Task
        </Link>
      </div>
      <button 
        onClick={() => tasksQuery.refetch()}
        style={{ marginTop: '20px' }}
      >
        Refresh Tasks
      </button>
    </div>
  );
}