import style from './StickyNote.module.css';
import { MdDelete, MdModeEdit, MdStar, MdStarBorder } from 'react-icons/md';
import { StickyNoteProps } from '../../types/types';
import { Button } from 'antd';

// Single Stick Note Functional Component
const StickyNote = (props: StickyNoteProps) => {
  const {
    color,
    description,
    isStarred,
    editNoteHandler,
    deleteNoteHandler,
    starredHandler,
  } = props;

  return (
    <div className={style.card} style={{ backgroundColor: color }}>
      <p className={style.description}>{description}</p>
      <div className={style.actionButton}>
        <Button onClick={editNoteHandler} icon={<MdModeEdit />} />
        <Button onClick={deleteNoteHandler} icon={<MdDelete />} />
        <Button
          onClick={starredHandler}
          icon={isStarred ? <MdStar /> : <MdStarBorder />}
        />
      </div>
    </div>
  );
};

export default StickyNote;
