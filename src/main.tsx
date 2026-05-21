import './styles.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routeTree } from './routeTree.gen';


// 1. Create the QueryClient OUTSIDE the component
const queryClient = new QueryClient();

// 2. Pass it into the router's context
const router = createRouter({ 
  routeTree,
  context: {
    queryClient, // This matches the context type in __root.tsx
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);