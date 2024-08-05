import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';

import Disconnected from '@/pages/Disconnected';
import Forbidden from '@/pages/Forbidden';
import Login from '@/pages/Login';
import Layout from '@/pages/Layouts';
import PendingAudit from '@/pages/pendingAudit';
import UserInfo from '@/pages/userInfo';
import TaskInfo from '@/pages/taskInfo';
import DataStatic from '@/pages/dataStatic';

const rootRouter = [
  {
    path: '/',
    element: <Navigate to='/login' />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/errands',
    element: <Layout />,
    children: [
      {
        path: 'user',
        element: <UserInfo />,
      },
      {
        path: 'audit',
        element: <PendingAudit />,
      },
      {
        path: 'task',
        element: <TaskInfo />,
      },
      {
        path: 'static',
        element: <DataStatic />,
      },
    ],
  },
  {
    path: '/404',
    element: <Forbidden />,
  },
  {
    path: '/500',
    element: <Disconnected />,
  },
  {
    path: '*',
    element: <Navigate to='/404' />,
  },
];

export const WRouters: React.FC = () => {
  const routes = useRoutes(rootRouter);
  return routes;
};

