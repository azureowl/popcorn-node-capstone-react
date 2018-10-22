import React from "react";
import Welcome from "./Welcome";
import Header from "./Header";
import Videos from './Videos';
import Footer from "./Footer";

export default function SearchPage(props) {
  return (
    <div>
      <Welcome />
      <Header />
      <section className="watchlist">
          <h2>My Watchlist</h2>
          <Videos />
      </section>
      <Footer />
    </div>
  );
}

