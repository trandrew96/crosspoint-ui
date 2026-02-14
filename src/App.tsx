import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import Search from "./pages/Search";
import Popular from "./pages/Popular";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import About from "./pages/About";
import NotFoundPage from "./pages/NotFoundPage";
import GameById from "./pages/GameById";
import Explore from "./pages/Explore";
import CreateReview from "./pages/CreateReview";
import MyReviews from "./pages/MyReviews";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Explore /> },
      { path: "/popular", element: <Popular /> },
      { path: "/search", element: <Search /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/profile", element: <Profile /> },
      { path: "/account", element: <Account /> },
      { path: "/games/:id", element: <GameById /> },
      { path: "/games/:gameId/review", element: <CreateReview /> },
      { path: "/my-reviews", element: <MyReviews /> },
      { path: "/about", element: <About /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);

function App() {
  return <></>;
}

export default App;
