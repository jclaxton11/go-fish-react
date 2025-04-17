// src/components/Deck.js
import React from 'react';
import { Card } from './CardComponent';
import { Container, Row, Col } from 'react-bootstrap';

const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const Deck = () => {
  const cards = [];

  suits.forEach((suit) => {
    values.forEach((value) => {
      cards.push({ suit, value });
    });
  });

  return (
    <Container fluid>
      <Row xs={6} sm={8} md={10} lg={12}>
        {cards.map((card, index) => (
          <Col key={index} className="d-flex justify-content-center mb-2">
            <Card suit={card.suit} value={card.value} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Deck;
