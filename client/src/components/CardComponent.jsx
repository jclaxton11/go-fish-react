// src/components/Card.js
import React from 'react';
import { Card as BootstrapCard } from 'react-bootstrap';

const suitSymbols = {
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
};

export const Card = ({ value, suit }) => {
  const symbol = suitSymbols[suit.toLowerCase()];
  const isRed = suit === 'hearts' || suit === 'diamonds';

  return (
    <BootstrapCard
      style={{ width: '4rem', height: '6rem', margin: '0.3rem' }}
      bg="light"
      border={isRed ? 'danger' : 'dark'}
      text={isRed ? 'danger' : 'dark'}
      className="text-center"
    >
      <BootstrapCard.Body style={{ padding: '0.4rem' }}>
        <BootstrapCard.Title style={{ fontSize: '1.2rem' }}>{value}</BootstrapCard.Title>
        <div style={{ fontSize: '1.4rem' }}>{symbol}</div>
      </BootstrapCard.Body>
    </BootstrapCard>
  );
};

export default Card;
