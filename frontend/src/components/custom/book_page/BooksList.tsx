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
              {book.title}<span className="text-zinc-400">.pdf</span>
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