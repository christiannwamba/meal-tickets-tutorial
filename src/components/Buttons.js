import React from 'react';
import { Link } from 'react-router-dom';

import BackIcon from '../arrow-left.svg';

export function InvalidateButton({ onClick, ...props }) {
  return (
    <button className="invalidate-btn" onClick={onClick} {...props}>
      Invalidate
    </button>
  );
}

export function GenerateButton({ onClick, ...props }) {
  return (
    <button className="invalidate-btn" onClick={onClick} {...props}>
      Generate
    </button>
  );
}

export function BackButton(props) {
  return (
    <Link className="back-btn" to="/" {...props}>
      <img src={BackIcon} alt="Go back" />
    </Link>
  );
}
