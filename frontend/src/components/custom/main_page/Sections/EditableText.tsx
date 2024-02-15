import React, { useState, useRef, useEffect } from 'react';
import './style.css';

interface EditableTextProps {
  initialText: string;
  onTextChange: (text: string) => void;
}

export const EditableText: React.FC<EditableTextProps> = ({ initialText, onTextChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    if (event.type === 'blur' || (event.type === 'keydown' && (event as React.KeyboardEvent<HTMLInputElement>).key === 'Enter')) {
      setIsEditing(false);
      if (onTextChange) {
        onTextChange(text);
      }
    }
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <div className="section-name-container" onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          className="custom-text"
          type="text"
          maxLength={50}
          value={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleBlur}
          ref={inputRef}
        />
      ) : (
        <span className="custom-text">{text}</span>
      )}
    </div>
  );
};
