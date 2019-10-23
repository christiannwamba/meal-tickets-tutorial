import React, { useEffect } from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';

import { GenerateButton, BackButton } from '../components/Buttons';
import Ticket from '../components/Ticket';

const GENERATE_TICKET = gql`
  mutation GenerateTicket($data: MealTicketCreateInput!) {
    mealTicketCreate(data: $data) {
      id
    }
  }
`;

const onGenerateClick = (attendeeId, generateTicket) => {
  const data = {
    variables: {
      data: {
        valid: true,
        owner: {
          connect: {
            id: attendeeId,
          },
        },
      },
    },
  };
  generateTicket(data);
};

export default function Generate({ attendees, search, searchTerm }) {
  const [mealTicketCreate, { data }] = useMutation(GENERATE_TICKET);
  const attendeesWithNoOrInvalidTickets = hasInvalidTicket(attendees);

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
          {attendeesWithNoOrInvalidTickets.map((attendee) => (
            <Ticket key={attendee.id} attendee={attendee}>
              <GenerateButton
                onClick={() => onGenerateClick(attendee.id, mealTicketCreate)}
              ></GenerateButton>
            </Ticket>
          ))}
        </ul>
      </div>
    </>
  );
}

function hasInvalidTicket(attendees) {
  return attendees.filter(({ mealTickets: { items: mealTickets = [] } }) => {
    const hasInvalidTicket = mealTickets.every((ticket) => !ticket.valid);
    return hasInvalidTicket;
  });
}
