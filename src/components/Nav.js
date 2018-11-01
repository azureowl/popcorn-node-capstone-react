import React from "react";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logout } from "../actions";

import "./Nav.css";

export class Nav extends React.Component {

  logOut() {
    this.props.dispatch(logout());
  }

  render() {
    return (
      <nav>
        <ul className="nav-items">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/search">Search</Link>
          </li>
          <li>
            <Link to="/watchlist">Watchlist</Link>
          </li>
          <li>
            <Link className="account" to="/auth/login" onClick={() => this.logOut()}>Logout</Link>
          </li>
        </ul>
      </nav>
    );
  };
}

export const mapStateToProps = state => ({
  loggedIn: state.user
});

export default connect(mapStateToProps)(Nav);