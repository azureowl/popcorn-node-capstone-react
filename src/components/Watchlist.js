import React from "react";
import Nav from "./Nav";
import Videos from './Videos';

export default function SearchPage(props) {
  return (
    <div>
      <Nav />
      <section className="watchlist">
          <h2>My Watchlist</h2>
          <Videos />
      </section>
    </div>
  );
}
