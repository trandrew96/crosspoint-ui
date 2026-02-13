import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-primaryText">
      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      {/* <main className="flex-1 mx-auto w-full pt-24 pb-16"> */}
      <main className="max-w-7xl mx-auto w-full px-10 pt-24 pb-16">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
