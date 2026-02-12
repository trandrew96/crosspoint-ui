import Nav from "../components/Nav";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase"; // Adjust the path based on your file structure
import { signOut } from "firebase/auth";
import Footer from "../components/Footer";

const handleSignOut = async () => {
  try {
    await signOut(auth);
    alert("User signed out successfully");
  } catch (error) {
    console.error("Error signing out:", error);
  }
};

type Props = {};

function Profile({}: Props) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return (
      <>
        <Nav />
        <h2>Please return to home page</h2>
      </>
    );
  }

  return (
    <>
      <Nav />
      <main className="max-w-7xl mx-auto text-center mt-10">
        <div>Profile</div>
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
      <Footer />
    </>
  );
}

export default Profile;
