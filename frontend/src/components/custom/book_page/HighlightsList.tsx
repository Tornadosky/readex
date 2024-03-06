import { useState, useEffect } from 'react';
import type { IHighlight } from "./react-pdf-highlighter";

interface HighlightsListProps {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export default function highlightsList({ highlights, resetHighlights, toggleDocument }: HighlightsListProps)  {
  const [sortCriteria, setSortCriteria] = useState('');
  const [filterColor, setFilterColor] = useState('');
  const [filterPageNumber, setFilterPageNumber] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filteredHighlights, setFilteredHighlights] = useState<IHighlight[]>(highlights);

  const changeAlpha = (color: string, newAlpha: number) => {
    const rgb = color.match(/rgb\((\d+), (\d+), (\d+)\)/);
    const rgba = color.match(/rgba?\((\d+), (\d+), (\d+)(?:, (\d+(?:\.\d+)?))?\)/);
    if (rgb) {
      return `rgba(${rgb[1]}, ${rgb[2]}, ${rgb[3]}, ${newAlpha})`;
    } else if (rgba) {
      return `rgba(${rgba[1]}, ${rgba[2]}, ${rgba[3]}, ${newAlpha})`;
    }
    return color; // Return original if not RGB/RGBA
  };

  useEffect(() => {
    let processedHighlights = [...highlights];
  
    // Filter
    processedHighlights = processedHighlights.filter((highlight) => {
      // Filter by color
      if (filterColor && highlight.color !== filterColor) {
        return false;
      }
      // Filter by page number
      if (filterPageNumber && highlight.position.pageNumber !== parseInt(filterPageNumber, 10)) {
        return false;
      }
      // Filter by highlight type
      if (filterType) {
        const hasImage = !!highlight.content?.image;
        const isTypeMatch = (filterType === 'text' && !hasImage) || (filterType === 'image' && hasImage);
        return isTypeMatch;
      }
      return true;
    });
  
    // Sort
    if (sortCriteria === 'page-number') {
      processedHighlights.sort((a, b) => a.position.pageNumber - b.position.pageNumber);
    } else if (sortCriteria === 'text-length') {
      processedHighlights.sort((a, b) => (a.content.text?.length || 0) - (b.content.text?.length || 0));
    }
  
    setFilteredHighlights(processedHighlights);
  }, [highlights, filterColor, filterPageNumber, filterType, sortCriteria]);

  return (
    <>
      <p className="ellipsis flex items-center gap-1 m-3">
        <small>
          To create area highlight hold (Alt), then click and
          drag.
        </small>
      </p>

      <div className="m-4">
        <div>
          <label>Color:</label>
          <input
            type="text"
            className='m-2 p-1 rounded'
            value={filterColor}
            onChange={(e) => setFilterColor(e.target.value)}
            placeholder="rgb(255, 226, 143)"
          />
        </div>
        <div>
          <label>Page Number:</label>
          <input
            type="number"
            className='m-2 p-1 w-16 rounded'
            value={filterPageNumber}
            onChange={(e) => setFilterPageNumber(e.target.value)}
            placeholder="Page"
          />
        </div>
        <div>
          <label>Highlight Type:</label>
          <select className='m-2 p-1 rounded' value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">All</option>
            <option value="text">Text</option>
            <option value="image">Image</option>
          </select>
        </div>
        <div>
          <label>Sort:</label>
          <select className='m-2 p-1 rounded' value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
            <option value="">None</option>
            <option value="page-number">Page Number</option>
            <option value="text-length">Text Length</option>
          </select>
        </div>
      </div>
      
      <ul className="sidebar__highlights">
        {filteredHighlights.map((highlight, index) => (
          <li
            key={index}
            className="sidebar__highlight"
            style={{ backgroundColor: changeAlpha(highlight.color, 0.3) }}
            onClick={() => {
              updateHash(highlight);
            }}
          >
            <div>
              <strong>{highlight.comment.text}</strong>
              {highlight.content.text ? (
                <blockquote style={{ marginTop: "0.5rem" }}>
                  {`${highlight.content.text.slice(0, 90).trim()}…`}
                </blockquote>
              ) : null}
              {highlight.content.image ? (
                <div
                  className="highlight__image"
                  style={{ marginTop: "0.5rem" }}
                >
                  <img src={highlight.content.image} alt={"Screenshot"} />
                </div>
              ) : null}
            </div>
            <div className="highlight__location">
              Page {highlight.position.pageNumber}
            </div>
          </li>
        ))}
      </ul>
      <div className="p-4">
        <button onClick={toggleDocument}>Toggle PDF document</button>
      </div>
      {highlights.length > 0 ? (
        <div className="p-4">
          <button onClick={resetHighlights}>Reset highlights</button>
        </div>
      ) : null}
    </>
  );
}