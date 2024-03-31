import React, { useState } from 'react';
import { NotesIcon, DotsIcon } from '@/assets/svg';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';
import type { IBook } from './Sidebar';

interface BooksListProps {
  booksList: Array<IBook>;
  setBooksList: (value: any) => void;
}

const BooksList: React.FC<BooksListProps> = ({ booksList, setBooksList }) => {
    const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
    const [editingBookId, setEditingBookId] = useState<string | null>(null);
    const [editingTitle, setEditingTitle] = useState("");

    const handleDotsClick = (bookId: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault(); // Prevents the default action (navigation)
      event.stopPropagation(); // Stops the click event from propagating to the parent <a> tag
      setSelectedBookId(bookId); // Set the selected book ID
    };

    const handleMenuClick: MenuProps['onClick'] = (e) => {
      console.log('click', e);
      if (e.key === '3' && selectedBookId) { // If "Delete" is clicked
        const mutation = `
          mutation delBook($id: Int!) {
            delBook(id: $id) {
              id
            }
          }
        `;
        console.log(selectedBookId)
        
        const variables = {
          id: parseInt(selectedBookId),
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
          console.log(response.data);
          setBooksList((currentBooks: any) => currentBooks.filter((book: any) => book.id !== selectedBookId));
        })
        .catch(error => {
          console.error('Failed to delete book:', error);
        });

        setSelectedBookId(null); 
      }

      if (e.key === '2' && selectedBookId) { // If "Rename" is clicked
        // Find the book to prepopulate the editing title
        const bookToEdit = booksList.find(book => book.id === selectedBookId);
        if (bookToEdit) {
          setEditingTitle(bookToEdit.title);
          setEditingBookId(selectedBookId);
        }
      }

      if (e.key === '1' && selectedBookId) { // If "Download" is clicked
        const bookToDownload = booksList.find(book => book.id === selectedBookId);
        if (bookToDownload) {
          const a = document.createElement('a');
          //a.href = bookToDownload.url; // Use the URL from your book object
          a.download = bookToDownload.title + ".pdf"; // Use the book title as the filename
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
        }
      }
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
      })
      .catch(error => {
        console.error('Failed to update book title:', error);
      });
  
      // Reset editing state
      setEditingBookId(null);
    };

    const items: MenuProps['items'] = [
      {
        label: 'Download',
        key: '1',
        icon: <DownloadOutlined style={{ fontSize: "1rem" }} />,
      },
      {
        label: 'Rename',
        key: '2',
        icon: <EditOutlined style={{ fontSize: "1rem" }} />,
      },
      {
        label: 'Delete',
        key: '3',
        icon: <DeleteOutlined style={{ fontSize: "1rem" }} />,
        danger: true,
      },
    ];

    const menuProps = {
      items,
      onClick: handleMenuClick,
    };

    return (
      <div className="books-list">
        {booksList.map((book) => (
          <a 
            key={book.id} 
            className="group h-full flex items-center hover:bg-gray-100 p-2 rounded-lg transition-colors"
            draggable="false" 
            href={`http://localhost:5173/pdfs/${book.id}/view`}
          >
            <div className="shrink-0 items-center mr-2 flex">
              <NotesIcon />
            </div>
            <div className="text-ellipsis whitespace-nowrap overflow-hidden text-zinc-800">
              {editingBookId === book.id ? (
                <input
                  type="text"
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={() => updateBookTitle(book.id, editingTitle)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      updateBookTitle(book.id, editingTitle);
                    }
                  }}
                  autoFocus
                  className="text-black p-1 w-full bg-transparent border-b border-blue-400 focus:outline-none"
                />
              ) : (
                <span className="text-ellipsis whitespace-nowrap overflow-hidden text-zinc-800">
                  {book.title.replace(".pdf", "")}<span className="text-zinc-400">.pdf</span>
                </span>
              )}
            </div>
            <Dropdown menu={menuProps} trigger={['click']}>
              <button 
                className="ml-auto hidden group-hover:flex items-center"
                onClick={handleDotsClick(book.id)}
              >
                <DotsIcon />
              </button>
            </Dropdown>
            
          </a>
        ))}
      </div>
    );
  };

export default BooksList;