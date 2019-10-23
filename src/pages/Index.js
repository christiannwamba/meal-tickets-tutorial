import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@8base/react-sdk';
import LoginImage from '../login.svg';

export default function Index() {
  const date = new Date().toDateString();
  const { isAuthorized, authClient } = useContext(AuthContext);

  return (
    <>
      <div className="page-info">
        <img src="images/meal-ticket.svg" alt="" />
        <h1 className="img-title">meal ticket</h1>
        <p className="date">{date}</p>
      </div>
      {!isAuthorized ? (
        <div className="login-container">
          <img
            src={LoginImage}
            className="login-image"
            alt="Login to use the app"
          />
          <div>
            <button
              className="login-button"
              onClick={() => authClient.authorize()}
            >
              Login
            </button>
          </div>
        </div>
      ) : (
        <ul className="options">
          <li className="option-item">
            <Link to="/generate">
              <img src="images/generate-mt.svg" alt="generate meal ticket" />
              <h2>Generate Meal Ticket</h2>
            </Link>
          </li>
          <li className="option-item">
            <Link to="/tickets">
              <img src="images/find-mt.svg" alt="Find Meal Ticket" />
              <h2>Find Meal Ticket</h2>
            </Link>
          </li>
        </ul>
      )}
    </>
  );
}
