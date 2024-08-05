import { Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

import Home from "./pages/home";
import TaskPublish from "./pages/task/publish";
import TaskList from "./pages/task/list";
import TaskHistory from "./pages/task/history";
import TaskIncome from "./pages/task/income";

import Layout from "./layout";

export const routerData = [
  {
    path: '/',
    element: <Navigate to='/login' />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/task",
    element: <Layout />,
    children: [
      {
        path: "list",
        element: <TaskList />,
      },
      {
        path: "history",
        element: <TaskHistory />,
      },
      {
        path: "publish",
        element: <TaskPublish />,
      },
      {
        path: "income",
        element: <TaskIncome />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/404",
    element: <>404</>,
  },
  {
    path: "/500",
    element: <>500</>,
  },
  {
    path: "*",
    element: <Navigate to="/404" />,
  },
];
