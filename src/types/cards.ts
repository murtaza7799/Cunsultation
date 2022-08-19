export type CardDetail = {
  _id: string;
  title: string;
  description: string;
  columnId?: string;
  assignedTo?: string;
  boardId?: string;
  sequence?: number;
  label?: Label;
  questions?: Questions[];
  images?: [
    {
      id: string;
      image: string;
    }
  ];
};
export type Questions = {
  checked?: boolean;
  value?: string;
};

export type Label = {
  bg: string;
  type: string;
};

export type CardSlice = {
  cards: CardDetail[];
};
