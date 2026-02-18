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
import Home from "./pages/Home";
import CreateReview from "./pages/CreateReview";
import MyReviews from "./pages/MyReviews";
import ProtectedRoute from "./components/ProtectedRoute";
import MyPlaylists from "./pages/MyPlaylists";
import PlaylistDetail from "./pages/PlaylistDetail";
import EditPlaylist from "./pages/EditPlaylist";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/popular", element: <Popular /> },
      { path: "/search", element: <Search /> },
      { path: "/signup", element: <SignUp /> },
      { path: "/signin", element: <SignIn /> },
      { path: "/about", element: <About /> },
      { path: "*", element: <NotFoundPage /> },
      { path: "/games/:id", element: <GameById /> },
      { path: "/playlists/:id", element: <PlaylistDetail /> },

      // Protected Routes
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },

      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
      },
      {
        path: "/games/:gameId/review",
        element: (
          <ProtectedRoute>
            <CreateReview />
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-reviews",
        element: (
          <ProtectedRoute>
            <MyReviews />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "/playlist-test-page",
      //   element: (
      //     <ProtectedRoute>
      //       <PlaylistTestPage />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "/my-playlists",
        element: (
          <ProtectedRoute>
            <MyPlaylists />
          </ProtectedRoute>
        ),
      },
      {
        path: "/playlists/:id/edit",
        element: (
          <ProtectedRoute>
            <EditPlaylist />
          </ProtectedRoute>
        ),
      },

      // { path: "/playlists/create", element: <ProtectedRoute><CreatePlaylist /></ProtectedRoute> },
    ],
  },
]);

function App() {
  return <></>;
}

export default App;
