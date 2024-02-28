import type { IHighlight } from "./react-pdf-highlighter";

interface HighlightsListProps {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export default function highlightsList({ highlights, resetHighlights, toggleDocument}: HighlightsListProps)  {
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

  return (
    <>
      <p className="ellipsis flex items-center gap-1 m-3">
        <small>
          To create area highlight hold (Alt), then click and
          drag.
        </small>
      </p>
      
      <ul className="sidebar__highlights">
        {highlights.map((highlight, index) => (
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