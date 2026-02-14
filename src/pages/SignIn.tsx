import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Redirect to home page
    } catch (error: any) {
      console.error(error);

      let errorMessage = "Failed to sign in";
      if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed attempts. Please try again later";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/"); // Redirect to home page
    } catch (error: any) {
      console.error(error);

      let errorMessage = "Failed to sign in with Google";
      if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in cancelled";
      } else if (
        error.code === "auth/account-exists-with-different-credential"
      ) {
        errorMessage = "An account already exists with this email";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl my-5 font-bold text-center">Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="flex flex-col gap-2 max-w-96 mx-auto">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <input
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              disabled={loading}
              required
            />
          </div>

          <div>
            <input
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              disabled={loading}
              required
            />
          </div>

          <button
            className="p-2 border border-transparent bg-gray-900 rounded-md w-full hover:bg-gray-800 transition-colors disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="flex items-center justify-center gap-2 p-2 border border-gray-300 bg-white text-gray-900 rounded-md w-full hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FcGoogle size={20} />
            <span>Sign in with Google</span>
          </button>

          {/* Link to Sign Up */}
          <p className="text-center text-sm text-gray-400 mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-500 hover:text-indigo-400 font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
