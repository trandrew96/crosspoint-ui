import { useState } from "react";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Nav from "../components/Nav";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Signed in successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Nav />
      <h2 className="text-2xl my-5 font-bold">Sign In</h2>
      <form onSubmit={handleSignIn}>
        <div className="flex flex-col gap-2 max-w-96 mx-auto">
          <div>
            {/* <label htmlFor="email">Email</label> */}
            <input
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            {/* <label htmlFor="password">Password</label> */}
            <input
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="p-2 border border-transparent bg-gray-900 rounded-md w-full"
            type="submit"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
