import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { gameAPI } from "../utils/apiClient";
import { GameCard } from "../components/GameCard";

const handleSignOut = async () => {
  try {
    await signOut(auth);
    alert("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

type Props = {};

interface LikedGame {
  id: number;
  name: string;
  cover?: {
    url: string;
  };
}

function Profile({}: Props) {
  const { user, loading } = useAuth();
  const [likedGames, setLikedGames] = useState<LikedGame[]>([]);

  useEffect(() => {
    if (user) {
      document.title = `${user.displayName || user.email}'s Profile - CrossPoint`;
    }
  }, [user]);

  useEffect(() => {
    // Fetch liked games when user is available
    const fetchLikedGames = async () => {
      if (!user) return;

      try {
        const response = await gameAPI.getLikedGames();

        setLikedGames(response.liked_games);
      } catch (error) {
        console.error("Error fetching liked games:", error);
      }
    };

    fetchLikedGames();
  }, [user]);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <>
        <h2>Please return to home page</h2>
      </>
    );
  }

  return (
    <>
      <main className="max-w-7xl mx-auto text-center mt-10">
        <div>Profile</div>
        <h1 className="text-2xl font-bold">
          Welcome, {user?.displayName || user.email}
        </h1>
        <h2>Likes</h2>
        {likedGames.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 my-5">
            {likedGames.map((game: LikedGame, index: number) => (
              <GameCard to={`/games/${game.id}`} key={index}>
                <img
                  className="object-cover rounded-lg
     transition-all duration-300 ease-out
     group-hover:brightness-110"
                  src={game.cover?.url}
                  alt={game.name}
                  width={200}
                />
              </GameCard>
            ))}
          </div>
        ) : (
          <p>No liked games yet</p>
        )}

        <div>
          <p>Email: {user.email}</p>
          <p>User ID: {user.uid}</p>
          {user?.displayName && <p>Display Name: {user.displayName}</p>}
          {user.photoURL && <img src={user.photoURL || ""} alt="Profile" />}
        </div>
        <button className="bg-amber-700 px-5 rounded" onClick={handleSignOut}>
          Sign Out
        </button>
      </main>
    </>
  );
}

export default Profile;
