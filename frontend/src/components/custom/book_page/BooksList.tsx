import React from 'react';
import { NotesIcon } from '@/assets/svg';

interface IBook {
  id: string;
  title: string;
  url: string;
}

interface BooksListProps {
  books: Array<IBook>;
}

const BooksList: React.FC<BooksListProps> = ({ books }) => {
    return (
      <div className="books-list">
        {books.map((book) => (
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
            <button className="ml-auto hidden group-hover:flex items-center">
              <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </a>
        ))}
      </div>
    );
  };

export default BooksList;