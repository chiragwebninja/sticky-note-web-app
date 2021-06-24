import style from './StickyNoteList.module.css';
import { useState } from 'react';
import StickyNote from '../StickyNote/StickyNote';
import ReactColorPicker from '@super-effective/react-color-picker';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from 'array-move';
import { Layout, Row, Col, Select, Button } from 'antd';
import { SortableItemProps, SortableListProps, INote } from '../../types/types';
import { MdAddCircleOutline, MdRemoveCircleOutline } from 'react-icons/md';

const { Content } = Layout;
const { Option } = Select;

// Sortable Element Wrapper for each item
const SortableItem = SortableElement(({ children }: SortableItemProps) => {
  return <li style={{ listStyle: 'none' }}>{children}</li>;
});

// Sortable Component Wrapper for Sticky Notes
const SortableList = SortableContainer((props: SortableListProps) => {
  const { items, editNoteHandler, deleteNoteHandler, starredHandler } = props;
  return (
    <ul className={style.cardList}>
      {items.map((note: INote, index: number) => (
        <SortableItem key={`item-${note.id}`} index={index}>
          <StickyNote
            key={note.id}
            id={note.id}
            index={index}
            description={note.description}
            color={note.color}
            isStarred={note.isStarred}
            editNoteHandler={() => editNoteHandler(note.id)}
            deleteNoteHandler={() => deleteNoteHandler(note.id)}
            starredHandler={() => starredHandler(note.id)}
          />
        </SortableItem>
      ))}
    </ul>
  );
});

/**
 * Stick Note List Functional Component
 * @returns
 */
const StickyNoteList = () => {
  const [description, setDescription] = useState<string>('');
  const [color, setColor] = useState('#3cd6bf');
  const [notes, setNotes] = useState<INote[]>([]);
  const [selectedNote, setselectedNote] = useState<INote>();
  const [showStarredNotes, setShowStarredNotes] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  // Handle Submit for Creating New Note
  const handleSubmit = () => {
    const note: INote = {
      id: selectedNote?.id ? selectedNote.id : +new Date(),
      description,
      color,
      isStarred: false,
    };
    let newNotes;
    if (selectedNote?.id) {
      newNotes = notes.map((oldNote: INote) => {
        if (oldNote.id === selectedNote.id) {
          return { ...note };
        }
        return oldNote;
      });
    } else {
      newNotes = [...notes, note];
    }
    setNotes(newNotes);
    setDescription('');
    setColor('#3cd6bf');
    setselectedNote(Object);
  };

  // Sorting Handler
  const sortEndHandler = ({ oldIndex, newIndex }: any) => {
    setNotes((items: INote[]) => arrayMove(items, oldIndex, newIndex));
  };

  // Change Color Handler
  const colorChangeHadler = (updatedColor: string) => {
    setColor(updatedColor);
  };

  // Edit Sticky Note Handler
  const editNoteHandler = (id: number) => {
    const note = notes.find((note: INote) => note.id === id);
    if (note) {
      setselectedNote(note);
      setDescription(note?.description);
      setColor(note?.color);
    }
  };

  // Delete Stick Note Handler
  const deleteNoteHandler = (id: number) => {
    setNotes((oldValue: INote[]) =>
      oldValue.filter((note: INote) => note.id !== id)
    );
  };

  // Handler for Starring Sticky Note
  const starredHandler = (id: number) => {
    const note = [...notes].find((note: INote) => note.id === id);
    if (note) {
      note.isStarred = !note.isStarred;
      const newNotes = notes.map((oldNote: INote) => {
        if (oldNote.id === note.id) {
          return { ...note };
        }
        return oldNote;
      });
      setNotes(newNotes);
    }
  };

  // On Select Handler for Sticky Notes Filter
  const selectHandler = () => setShowStarredNotes((prevStar) => !prevStar);

  return (
    <>
      <Layout className={style.layout}>
        <div className={style.leftSidebar}>
          <div className={style.titleHeader}>
            <h3>Sticky Notes</h3>
            <Button
              className={style.hide}
              type="primary"
              shape="circle"
              icon={show ? <MdRemoveCircleOutline /> : <MdAddCircleOutline />}
              size="large"
              onClick={() => {
                setShow((preValue) => !preValue);
              }}
            />
          </div>

          <div className={`${style.addStickyCard} ${show ? style.show : ''}`}>
            <textarea
              placeholder="Add description for sticky note"
              name="decription"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              cols={50}
              rows={5}
            />

            <div className={style.colorPalate}>
              <ReactColorPicker color={color} onChange={colorChangeHadler} />
            </div>

            <div className={style.addButton}>
              <Button
                type="primary"
                shape="round"
                onClick={handleSubmit}
                icon={<MdAddCircleOutline />}
                size="large"
              >
                {selectedNote && selectedNote.id
                  ? 'Update Sticky Note'
                  : 'Add Sticky Note'}
              </Button>
            </div>
          </div>
        </div>
        <div className={style.rightSideWrapper}>
          <Content style={{ padding: '1rem 2rem' }}>
            <Row>
              <Col span={24}>
                <Select
                  className={style.filterSelection}
                  placeholder="Filter Sticky Notes"
                  onChange={selectHandler}
                >
                  <Option value="all">All Notes</Option>
                  <Option value="starred">Starred Notes</Option>
                </Select>

                <SortableList
                  axis={'xy'}
                  items={
                    showStarredNotes
                      ? notes.filter((note: INote) => note.isStarred)
                      : notes
                  }
                  onSortEnd={sortEndHandler}
                  editNoteHandler={editNoteHandler}
                  deleteNoteHandler={deleteNoteHandler}
                  starredHandler={starredHandler}
                />
              </Col>
            </Row>
          </Content>
        </div>
      </Layout>
    </>
  );
};

export default StickyNoteList;
