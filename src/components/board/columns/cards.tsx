import React, { FC } from 'react';
import PropTypes from 'prop-types';
import { CardDetail } from '@/src/types/cards';
import Card from '@/src/components/board/columns/card';

type Props = {
  cards: CardDetail[];
  filter: string;
  showCardDetail: (cardId: string) => void;
};

const Cards: FC<Props> = ({ cards, showCardDetail, filter }) => {
  // cards.filter((card) => console.log(card.label?.bg));
  // console.log('filter', filter);
  // console.log(
  //   'cards',
  //   cards?.filter((card) => (filter === null ? card.title : card.label?.type === filter))
  // );
  return (
    <>
      {cards
        ?.filter((card) => (filter === null ? card.title : card.label?.type === filter))
        .map((card, index) => (
          <Card key={index} card={card} cardIndex={index} showCardDetail={showCardDetail} />
        ))}
    </>
  );
};

Cards.propTypes = {
  showCardDetail: PropTypes.func
};

export default Cards;
