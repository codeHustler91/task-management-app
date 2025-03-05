import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient, queryClient } from './utils/trpc';
import { TaskList } from './pages/TaskList';
import { TaskDetail } from './pages/TaskDetail';
import { CreateTask } from './pages/CreateTask';
import { Layout } from './components/Layout';

export function App() {
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/task/:id" element={<TaskDetail />} />
            <Route path="/create" element={<CreateTask />} />
          </Routes>
        </Layout>
      </QueryClientProvider>
    </trpc.Provider>
  );
}