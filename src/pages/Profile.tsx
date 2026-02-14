import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { gameAPI } from "../utils/apiClient";
import { GameCard } from "../components/GameCard";

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
        <h1 className="text-2xl font-bold">
          Welcome, {user?.displayName || user.email}
        </h1>
        {/* <span className="text-sm text-gray-500">User ID: {user.uid}</span> */}
        <h2 className="text-4xl font-semibold mt-4">My Likes</h2>
        {likedGames.length > 0 ? (
          <div className="grid grid-cols-3 md:grid-cols-8 gap-4 my-5 mx-auto">
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
      </main>
    </>
  );
}

export default Profile;
