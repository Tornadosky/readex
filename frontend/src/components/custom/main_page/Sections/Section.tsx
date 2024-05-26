import React, { useState, useEffect } from "react";
import { Book } from "./Book";
import { AddBook } from "./AddBook";
import { EditableText } from "./EditableText";
import DeleteIcon from '@mui/icons-material/Delete';
import MyCircularProgress from './MyCircularProgress';

import { AlertDialog } from '../AlertDialog.jsx';

import axios from 'axios';
import "./style.css";

const VerticalLine = () => {
    return <div className="vertical-line"></div>;
};

interface BookType {
  id: number;
  title: string;
  is_processed: boolean;
  cover_image: string;
  index: number;
}

interface SectionProps {
  booksList: BookType[];
  name: string;
  sectionId: number;
  handleDeleteSection: (sectionId: number, name: string) => void;
  globalLoading: number;
  setGlobalLoading: React.Dispatch<React.SetStateAction<number>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sectionIdModal: number | null;
  setSectionIdModal: React.Dispatch<React.SetStateAction<number | null>>;
  setBooksList: (value: any) => void;
}

export const Section: React.FC<SectionProps> = ({
  booksList,
  name,
  sectionId,
  handleDeleteSection,
  globalLoading,
  setGlobalLoading,
  isModalOpen,
  setIsModalOpen,
  sectionIdModal,
  setSectionIdModal,
  setBooksList,
}) => {
  const [books, setBooks] = useState<BookType[]>(booksList);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [bookActionConfirmation, setBookActionConfirmation] = useState<{
    id: number;
    name: string;
  }>({
    id: -1,
    name: '',
  });

  const addNewBook = (file: any, newId: number, cover_image: string) => {
    console.log(file);
    const newBook = {
      id: newId,
      title: file.name.replace(/\.[^/.]+$/, ""),
      is_processed: true,
      cover_image: cover_image,
      index: books.length,
    };
    setBooks(prevBooks => [...prevBooks, newBook]);  
    setGlobalLoading(prev => Math.max(prev - 1, 0));
  };

  const handleSectionNameChange = async (newName: string) => {
    try {
      const mutation = `
        mutation UpdateCollection($id: ID!, $newTitle: String!) {
          setCollection(id: $id, title: $newTitle) {
            id
            title
          }
        }
      `;

      const variables = {
        id: sectionId,
        newTitle: newName,
      };

      const response = await axios.post('http://localhost:3000/graphql', {
        query: mutation,
        variables,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data && !response.data.errors) {
        console.log(`Successfully changed section name to ${newName}`);
      } else {
        console.error('Failed to update section name');
        alert('Failed to update section name');
      }
    } catch (error) {
      console.error('Error during the API call', error);
      alert('Error during the API call');
    }
  };

  const moveBookInsideSection = async (sourceIndex: number, destinationIndex: number) => {
    try {
      // const response = await client.post('api/book/change-index/', { section_id: sectionId, source_index: sourceIndex, destination_index: destinationIndex });

      // if (response.status === 200) {
      //   console.log(sourceIndex, destinationIndex)
      //   const updatedBooks = [...books];

      //   [updatedBooks[sourceIndex], updatedBooks[destinationIndex]] = [updatedBooks[destinationIndex], updatedBooks[sourceIndex],];
      //   [updatedBooks[sourceIndex].index, updatedBooks[destinationIndex].index] = [updatedBooks[destinationIndex].index, updatedBooks[sourceIndex].index,];

      //   console.log('swap', updatedBooks);

      //   setBooks(updatedBooks);
      // } else {
      //   console.error('Failed to move the book');
      //   alert('Failed to move the book');
      // }
      console.log(`Move book from ${sourceIndex} to ${destinationIndex}`);
    } catch (error) {
      console.error('Error during the API call', error);
      alert('Error during the API call');
    }
  };

  const handleDelete = () => {
    handleDeleteSection(sectionId, name);
  };

  const handleBookActionConfirmation = (id: number, name: string) => {
    setBookActionConfirmation({ id, name });
    setAlertOpen(true);
  };

  const handleClose = async (confirmed: boolean) => {
    setAlertOpen(false);
    const { id, name } = bookActionConfirmation;

    if (confirmed) {
      try {
        const mutation = `
          mutation delBook($id: Int!) {
            delBook(id: $id) {
              id
            }
          }
        `;
        console.log("Deleted Book", id, name);
        
        const variables = {
          id: parseInt(id as any),
        };

        axios.post('http://localhost:3000/graphql', {
          query: mutation,
          variables: variables,
        }, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(response => {
          console.log(`Delete book ${id}`);
          setBooksList((currentBooks: any) => currentBooks.filter((book: any) => book.id !== id));
        })
        .catch(error => {
          console.error('Failed to delete book:', error);
        });
      } catch (error) {
        console.error('Error during the API call', error);
        alert('Error during the API call');
      }
    }
    setBookActionConfirmation({ id: -1, name: '' });
  };

  return (
    <div className="custom-container">
      <AlertDialog open={alertOpen} handleClose={handleClose} actionConfirmation={bookActionConfirmation} type={'Book'}/>
      <div className="section-header">
        <EditableText initialText={name} onTextChange={handleSectionNameChange} />
        <span className="trashbin-icon">
          <div className="section-icon">
            <DeleteIcon style={{ cursor: 'pointer' }} onClick={handleDelete}/>
          </div>
        </span>
      </div>
      <div className="custom-rectangle">
        {books.map((book) => (
            <React.Fragment key={book.id}>
              <Book
                key={book.id}
                book={book}
                setBooksList={setBooksList}
                sectionId={sectionId}
                index={book.index}
                moveBookInsideSection={moveBookInsideSection}
                handleDeleteBook={handleBookActionConfirmation}
              />
              <VerticalLine />
            </React.Fragment>
          ))}
        {
          (loading && (
            <React.Fragment>
              <div className="vertical-container add-book loading">
                <div className="vertical-rectangle">
                  <MyCircularProgress determinate={false} />
                  <div className="estimated-time">
                    {'Loading'}
                  </div>
                </div>
              </div>
              <VerticalLine />
            </React.Fragment>
          ))
        }
        <AddBook
          onFileSelect={addNewBook}
          sectionIdModal={sectionIdModal}
          setSectionIdModal={setSectionIdModal}
          setIsModalOpen={setIsModalOpen}
          sectionId={sectionId}
          globalLoading={globalLoading}
          setGlobalLoading={setGlobalLoading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};