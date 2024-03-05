import { Component } from "react";

import "../style/Highlight.css";

import type { LTWHP } from "../types.js";

interface Props {
  position: {
    boundingRect: LTWHP;
    rects: Array<LTWHP>;
  };
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onDelete: () => void;
  comment: {
    emoji: string;
    text: string;
  };
  color: string;
  isScrolledTo: boolean;
}

export class Highlight extends Component<Props> {
  timeoutRef: NodeJS.Timeout | null = null;

  render() {
    const {
      position,
      onClick,
      onMouseOver,
      onMouseOut,
      onDelete,
      comment,
      color,
      isScrolledTo,
    } = this.props;
    
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete') {
        onDelete();
      }
    };

    const { rects, boundingRect } = position;

    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
        onMouseDown={(event) => {
          // Clear existing timeout to ensure not setting up multiple listeners
          if (this.timeoutRef) {
            clearTimeout(this.timeoutRef);
          }
          document.addEventListener('keydown', onKeyDown);
          // Set another timeout to remove the listener after 3 seconds
          setTimeout(() => {
            document.removeEventListener('keydown', onKeyDown);
          }, 3000);
        }}
      >
        {comment ? (
          <div
            className="Highlight__emoji"
            style={{
              left: 20,
              top: boundingRect.top,
              fontSize: rects[0].height,
            }}
          >
            {comment.emoji}
          </div>
        ) : null}
        <div className="Highlight__parts">
          {rects.map((rect, index) => {
            //console.log('color', color);

            return (
              <div
                onMouseOver={onMouseOver}
                onMouseOut={onMouseOut}
                onClick={onClick}
                key={index}
                className="Highlight__part"
                style={
                  isScrolledTo ? rect : { ...rect, backgroundColor: color }
                }
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default Highlight;
