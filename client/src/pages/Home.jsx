import React from "react";
import Login from "../components/Login";
import UserInfo from "../components/UserInfo";
import Footer from "../components/Footer";
import View from "../components/View";
import Loto from "../components/Loto";

const Home = () => {
  return (
    <div className="home">
      <main className="mt-6 space-y-6 max-w-screen">
        <div className="w-full max-w-7xl mx-auto p-4">
          <UserInfo />
          <Login />
        </div>
      </main>
    </div>
  );
};

export default Home;
