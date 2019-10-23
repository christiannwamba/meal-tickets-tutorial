import React from 'react';

export default function Ticket({ children, attendee }) {
  const validTickets = getValidTickets(attendee.mealTickets.items);
  return (
    <li className="card-item">
      <svg className="search">
        <use href="images/icons.svg#card"></use>
      </svg>
      <div>
        <h3>{attendee.name}</h3>
        {validTickets.length > 0 && (
          <p>
            ID: <span>{extractTicketShortId(validTickets[0].id)}</span>
          </p>
        )}
      </div>
      {children}
    </li>
  );
}

function getValidTickets(tickets) {
  return tickets.filter((ticket) => ticket.valid);
}

function extractTicketShortId(longId) {
  const longIdLength = longId.length;
  return longId.slice(longIdLength - 5, longIdLength).toUpperCase();
}
