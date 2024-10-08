import React, { useState, useRef } from "react";
import { useDrag, useDrop } from 'react-dnd';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';
import book1Cover from '../../../../assets/book1_cover.png';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

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
  handleDeleteBook: (bookId: number, bookName: string) => void;
  setBooksList: (value: any) => void;
}

export const Book: React.FC<BookProps> = ({ book, sectionId, index, moveBookInsideSection, handleDeleteBook, setBooksList }) => {
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

  const updateBookTitle = (id: string, newTitle: string) => {
    const mutation = `
      mutation UpdateBook($id: Int!, $title: String!, $user: Int!) {
        setBook(id: $id, title: $title, user: $user) {
          id
          title
        }
      }
    `;

    axios.post('http://localhost:3000/graphql', {
      query: mutation,
      variables: {
        id: parseInt(id),
        title: newTitle + ".pdf",
        user: 1,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      console.log(response.data);
      // Update the local state to reflect the new title
      setBooksList((currentBooks: any) =>
        currentBooks.map((book: any) =>
          book.id === id ? { ...book, title: newTitle } : book
        )
      );
      setIsEditing(false);
    })
    .catch(error => {
      console.error('Failed to update book title:', error);
      alert('Failed to rename the book');
    });
  };

  const handleSaveEdit = async () => {
    try {
      updateBookTitle(book.id.toString(), editedName);
      console.log(`Change book title to ${editedName}`);
    } catch (error) {
      console.error('Error during the API call', error);
      alert('Error during the API call');
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };
  
  const handleBookClick = () => {
    navigate(`/pdfs/${book.id}/view`)
  };

  const displayContent = (
    <>
      <div className="icons-container">
        {/* <Icon name="pencil" onClick={handleEditClick} src={require("../../images/icon-pencil.png")} /> */}
        <CreateIcon name="pencil" style={{ cursor: 'pointer' }} onClick={handleEditClick}/>
        {/* <Icon name="trashbin" onClick={handleDelete} src={require("../../images/icon-trashbin.png")} /> */}
        <DeleteIcon name="trashbin" style={{ cursor: 'pointer' }} onClick={handleDelete}/>
      </div>
      <div className={'vertical-rectangle'} onClick={handleBookClick}>
        <img className="book-cover" src={`${book.cover_image ? 'http://localhost:3000/' + book.cover_image.replace('uploads\\', '') : book1Cover}`} alt={book.title} />
      </div>
      <div className='name-text'>
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