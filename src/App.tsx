import "./App.css";
import { createBrowserRouter } from "react-router-dom";
import Search from "./pages/Search";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Profile from "./pages/Profile";
import About from "./pages/About";
import NotFoundPage from "./pages/NotFoundPage";
import GameById from "./pages/GameItemFast";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/explore", element: <Search /> },
  { path: "/sign-up", element: <SignUp /> },
  { path: "/sign-in", element: <SignIn /> },
  { path: "/profile", element: <Profile /> },
  { path: "/games/:id", element: <GameById /> },
  { path: "/about", element: <About /> },
  { path: "*", element: <NotFoundPage /> },
]);

function App() {
  return <></>;
}

export default App;
