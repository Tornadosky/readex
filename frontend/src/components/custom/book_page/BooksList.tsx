import React, { useState } from 'react';
import { NotesIcon, DotsIcon } from '@/assets/svg';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import { DeleteOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';


interface IBook {
  id: string;
  title: string;
  url: string;
}

interface BooksListProps {
  books: Array<IBook>;
}

const BooksList: React.FC<BooksListProps> = ({ books }) => {
    const [booksList, setBooksList] = useState<Array<IBook>>(books);
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
        setBooksList(currentBooks => currentBooks.filter(book => book.id !== selectedBookId));
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
          a.href = bookToDownload.url; // Use the URL from your book object
          a.download = bookToDownload.title + ".pdf"; // Use the book title as the filename
          document.body.appendChild(a);
          a.click();

          document.body.removeChild(a);
        }
      }
    };

    const items: MenuProps['items'] = [
      {
        label: 'Download',
        key: '1',
        icon: <DownloadOutlined />,
      },
      {
        label: 'Rename',
        key: '2',
        icon: <EditOutlined />,
      },
      {
        label: 'Delete',
        key: '3',
        icon: <DeleteOutlined />,
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
            href={book.url}
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
                  onBlur={() => {
                    // Call a function to update the book's title
                    // Reset editing state
                    const updatedBooks = booksList.map(b => {
                      if (b.id === editingBookId) {
                        return { ...b, title: editingTitle };
                      }
                      return b;
                    });
                    setBooksList(updatedBooks);
                    setEditingBookId(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      // Same as onBlur
                      const updatedBooks = booksList.map(b => {
                        if (b.id === editingBookId) {
                          return { ...b, title: editingTitle };
                        }
                        return b;
                      });
                      setBooksList(updatedBooks);
                      setEditingBookId(null);
                    }
                  }}
                  autoFocus
                  className="text-black p-1 w-full bg-transparent border-b border-blue-400 focus:outline-none"
                />
              ) : (
                <span className="text-ellipsis whitespace-nowrap overflow-hidden text-zinc-800">
                  {book.title}<span className="text-zinc-400">.pdf</span>
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