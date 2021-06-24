export interface INote {
  id: number;
  description: string;
  color: string;
  isStarred: boolean;
}

export interface SortableItemProps {
  children: React.ReactNode;
}

export interface SortableListProps {
  items: INote[];
  editNoteHandler(id: number): void;
  deleteNoteHandler(id: number): void;
  starredHandler(id: number): void;
}

export interface StickyNoteProps {
  id: number;
  index: number;
  color: string;
  description: string;
  isStarred: boolean;
  editNoteHandler(): void;
  deleteNoteHandler(): void;
  starredHandler(): void;
}
