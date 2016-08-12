export interface board {
  id: string;
  name: string;
  desc: string;
  lists: list[];
}

export interface list {
  id: string;
  name: string;
  cards: card[];
}

export interface card {
  id?: string;
  name: string;
  desc: string;
  list?: list;
  idList?: string;
  dragging?: boolean;
  posX?: number;
  posY?: number;
  visualX?: number;
  visualY?: number;
}

export interface event {
  clientX: number;
  clientY: number;
}