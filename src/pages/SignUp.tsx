import { useState } from "react";
import { auth } from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Nav from "../components/Nav";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // To create the user with email and password
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("User created successfully");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Nav />
      <h2 className="text-2xl my-5 font-bold">Register your Account</h2>
      <form onSubmit={handleCreateUser}>
        <div className="flex flex-col gap-2 max-w-96 mx-auto">
          <div>
            {/* <label>Name</label> */}
            <input
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Name"
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            {/* <label htmlFor="email">Email</label> */}
            <input
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Email"
              type="email"
              id="email"
              name="email"
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
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            {/* <label htmlFor="confirm_password" className={"block mb-2"}>
            Confirm Password
          </label> */}
            <input
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Confirm Password"
              type="password"
              id="confirm_password"
              name="confirm_password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="my-5">
            <input type="checkbox" id="terms" name="terms" className="mr-2" />
            <label htmlFor="terms">
              I agree to the <a href="#">Terms and Conditions</a>
            </label>
          </div>

          <button
            className="p-2 border border-transparent bg-gray-900 rounded-md w-full"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
