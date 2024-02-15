import React, { useState, useRef } from "react";
import { useDrag, useDrop } from 'react-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import { useNavigate } from "react-router-dom";

import './style.css';

interface Book {
  id: number;
  title: string;
  is_processed: boolean;
  cover_image?: string;
}

interface BookProps {
  book: Book;
  sectionId: number;
  index: number;
  moveBookInsideSection: (sourceIndex: number, destinationIndex: number) => void;
  client: any;
  handleDeleteBook: (bookId: number, bookName: string) => void;
}

export const Book: React.FC<BookProps> = ({ book, sectionId, index, moveBookInsideSection, client, handleDeleteBook }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(book.title.replace(/\.[^/.]+$/, ""));
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (isEditing && event.key === 'Enter') {
      handleSaveEdit();
    }
  };

  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'BOOK',
    item: { id: book.id, sectionId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [book.id, sectionId, index]); 

  const [, dropRef] = useDrop(() => ({
    accept: 'BOOK',
    drop: (item: { id: string | number; sectionId: string | number; index: number; }) => {
      if (item.sectionId === sectionId) {
        moveBookInsideSection(item.index, index);
      }
    },
  }), [sectionId, index]); 

  const handleDelete = () => {
    handleDeleteBook(book.id, editedName);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await client.post('api/book/change-title/', { book_id: book.id, title: editedName });

      if (response.status === 200) {
        setIsEditing(false);
      } else {
        console.error('Failed to rename the book');
        alert('Failed to rename the book');
      }
    } catch (error) {
      console.error('Error during the API call', error);
      alert('Error during the API call');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };
  
  const handleBookClick = () => {
    navigate('/books-reading');
  }

  const displayContent = (
    <>
      <div className="icons-container">
        {/* <Icon name="pencil" onClick={handleEditClick} src={require("../../images/icon-pencil.png")} /> */}
        <CreateIcon name="pencil" style={{ cursor: 'pointer' }} onClick={handleEditClick}/>
        {/* <Icon name="trashbin" onClick={handleDelete} src={require("../../images/icon-trashbin.png")} /> */}
        <DeleteIcon name="trashbin" style={{ cursor: 'pointer' }} onClick={handleDelete}/>
      </div>
      <div className={`vertical-rectangle ${!book.is_processed ? 'disabled-book' : ''}`} onClick={handleBookClick}>
        <img className="book-cover" src={`${book.cover_image ? book.cover_image : require('../../images/book1_cover.png')}`} alt={book.title} />
      </div>
      <div className={`name-text ${!book.is_processed ? 'disabled-book' : ''}`}>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedName}
              onChange={handleNameChange}
              onKeyDown={handleKeyPress}
              autoFocus
              ref={inputRef}
              onBlur={handleSaveEdit}
            />
          </>
        ) : (
          <span>{editedName.length > 15 ? `${editedName.slice(0, 15)}...` : editedName}</span>
        )}
      </div>
    </>
  );

  return (
    <div
    className={`vertical-container ${!book.is_processed ? 'disabled-book' : ''}`}
      ref={(node) => {
        dragRef(dropRef(node));
      }}
      style={{ opacity: isDragging || isEditing ? 0.5 : 1 }}
    >
      {displayContent}
    </div>
  );
};