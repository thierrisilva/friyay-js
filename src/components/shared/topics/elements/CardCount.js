import React from 'react';
import { array } from 'prop-types';

CardCount.propTypes = {
  cards: array.isRequired
}


export default function CardCount({cards}) {
  const numOfCards = cards.length;

  return(
    <span className="grey-words mr20">
      {numOfCards} cards
    </span>
  );
}
