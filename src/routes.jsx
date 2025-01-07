import App from "./App";
import ErrorPage from "./components/errorPage";
import Login from "./components/login";
import Register from "./components/register";

const routes = [
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/:page",
    element: <App />,
    errorElement: <ErrorPage />,
  }, 
  {
    path:"/:page/:elementid",
    element: <App />
  },
];

export default routes;