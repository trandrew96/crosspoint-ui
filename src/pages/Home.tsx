import React from "react";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="font-inter box-border">
      <Nav />

      <main className="text-center">
        <header className="mb-6">
          <h1 className="text-2xl m-0">CrossPoint</h1>
          <p className="mt-1.5">Welcome</p>
        </header>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
