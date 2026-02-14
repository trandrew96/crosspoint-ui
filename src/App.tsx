import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import Search from "./pages/Search";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import About from "./pages/About";
import NotFoundPage from "./pages/NotFoundPage";
import GameById from "./pages/GameItemFast";
import Explore from "./pages/Explore";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/search", element: <Search /> },
      { path: "/explore", element: <Explore /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/profile", element: <Profile /> },
      { path: "/account", element: <Account /> },
      { path: "/games/:id", element: <GameById /> },
      { path: "/about", element: <About /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return <></>;
}

export default App;
