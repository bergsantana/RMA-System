import { createHashRouter } from "react-router-dom";
import App from "../App";
import Login from "../views/Login/Login";
import RMA from "../views/RMA/RMA";
import Dashboard from "../views/Dashboard/Dashboard";
import Home from "../views/Home/Home";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/rma",
        element: <RMA />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

export default router;
