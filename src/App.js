import React, { useState, useContext, useEffect } from 'react';
import { Route } from 'react-router-dom';
import { AuthContext } from '@8base/react-sdk';
import { withApollo } from 'react-apollo';

import { useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import Index from './pages/Index';
import Generate from './pages/Generate';
import Tickets from './pages/Tickets';

import Auth from './pages/Auth';
import './App.css';

const GET_ATTENDEES = gql`
  query Attendees($searchTerm: String!) {
    attendeesList(filter: { name: { contains: $searchTerm } }) {
      count
      items {
        name
        id
        mealTickets {
          items {
            id
            valid
          }
        }
      }
    }
  }
`;

const ATTENDEES_SUB = gql`
  subscription AttendeeSub {
    MealTickets {
      node {
        owner {
          id
        }
        id
        valid
      }
      mutation
    }
  }
`;

function App() {
  const RouterApp = withApollo(AppRouter);
  return (
    <section className="wrapper">
      <RouterApp></RouterApp>
    </section>
  );
}

function AppRouter({ client }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [attendees, setAttendees] = useState([]);
  const { isAuthorized, authClient } = useContext(AuthContext);
  const { loading, data } = useQuery(GET_ATTENDEES, {
    variables: { searchTerm },
  });
  const subscription = useSubscription(ATTENDEES_SUB);
  const logout = async () => {
    await client.clearStore();
    authClient.logout();
  };

  useEffect(() => {
    if (!loading) {
      setAttendees(data.attendeesList.items);
      updateAttendeeRecord(subscription, attendees, setAttendees);
    }
  }, [data, subscription.data]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isAuthorized && (
            <div className="logout-container">
              <button className="logout-button" onClick={logout}>
                <p>
                  Logout <span>→</span>
                </p>
              </button>
            </div>
          )}

          <Route path="/" exact component={Index} />
          <Route path="/auth/callback" component={Auth} />
          <Route
            path="/generate/"
            component={() => (
              <Generate
                attendees={attendees}
                search={setSearchTerm}
                searchTerm={searchTerm}
              />
            )}
          />
          <Route
            path="/tickets/"
            component={() => (
              <Tickets
                attendees={attendees}
                search={setSearchTerm}
                searchTerm={searchTerm}
              />
            )}
          />
        </>
      )}
    </div>
  );
}

const updateAttendeeRecord = (subRes, attendees, setAttendees) => {
  if (subRes.data) {
    const { node, mutation } = subRes.data.MealTickets;
    const updatedAttendees = attendees.map((attendee) => {
      if (node.owner.id === attendee.id) {
        const tickets = attendee.mealTickets.items;
        if (mutation === 'create') {
          attendee.mealTickets = {
            items: attendee.mealTickets.items.concat(node),
          };
          return attendee;
        } else if (mutation === 'update') {
          const updatedTickets = attendee.mealTickets.items.map((item) => {
            if (item.id === node.id) {
              return {
                ...item,
                ...node,
              };
            }
            return item;
          });
          attendee.mealTickets = {
            items: updatedTickets,
          };
          return attendee;
        }
      } else {
        return attendee;
      }
    });
    setAttendees(updatedAttendees);
  }
};

export default App;
