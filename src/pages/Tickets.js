import React, { useEffect } from 'react';
import gql from 'graphql-tag';

import { useMutation } from '@apollo/react-hooks';

import Ticket from '../components/Ticket';
import { InvalidateButton, BackButton } from '../components/Buttons';

const INVALIDATE_TICKET = gql`
  mutation InvalidateTicket($data: MealTicketUpdateInput!) {
    mealTicketUpdate(data: $data) {
      id
    }
  }
`;

const getValidTicket = (tickets) => {
  return tickets.find((ticket) => ticket.valid);
};

const onInvalidateClick = (tickets, inValidateTicket) => {
  const validTicket = getValidTicket(tickets);
  const data = {
    variables: {
      data: {
        id: validTicket.id,
        valid: false,
      },
    },
  };
  inValidateTicket(data);
};

export default function Tickets({ attendees, search, searchTerm }) {
  const [mealTicketUpdate, { data }] = useMutation(INVALIDATE_TICKET);
  const attendeesWithValidTickets = hasValidTicket(attendees);
  return (
    <>
      <BackButton />
      <div className="search-wrapper-wp">
        <div className="search-wrapper">
          <a href="#search">
            <svg className="search">
              <use href="images/icons.svg#search"></use>
            </svg>
          </a>
          <input
            id="search"
            type="search"
            value={searchTerm}
            onChange={(e) => search(e.target.value)}
          />
        </div>
      </div>
      <div className="main-wrapper">
        <h2 className="page-title">SEARCH RESULT</h2>
        <ul className="search-result">
          {attendeesWithValidTickets.map((attendee) => (
            <Ticket attendee={attendee} key={attendee.id}>
              <InvalidateButton
                onClick={() =>
                  onInvalidateClick(
                    attendee.mealTickets.items,
                    mealTicketUpdate
                  )
                }
              ></InvalidateButton>
            </Ticket>
          ))}
        </ul>
      </div>
    </>
  );
}

function hasValidTicket(attendees) {
  return attendees.filter((attendee) => {
    const mealTickets = attendee.mealTickets.items;
    const validTickets = mealTickets.filter((ticket) => ticket.valid);
    return validTickets.length > 0;
  });
}
