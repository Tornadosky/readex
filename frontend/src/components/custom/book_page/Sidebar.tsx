import type { IHighlight } from "./react-pdf-highlighter";
import SidebarIcon from './SidebarIcon'; 
import { HomeIcon } from '@/assets/svg';


interface Props {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
}

const updateHash = (highlight: IHighlight) => {
  document.location.hash = `highlight-${highlight.id}`;
};

export function Sidebar({
  highlights,
  toggleDocument,
  resetHighlights,
}: Props) {
  return (
    <>
      <div className="flex flex-col items-center w-16 h-full overflow-hidden text-gray-700 bg-gray-100 rounded">
        <a className="flex items-center justify-center mt-3" href="#">
          <svg className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
          </svg>
        </a>
        <div className="flex flex-col items-center mt-3 border-t border-gray-300">
          <a className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-300" href="#">
            <HomeIcon />
          </a>
          <a className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-300" href="#">
            <HomeIcon />
          </a>
          <a className="flex items-center justify-center w-12 h-12 mt-2 bg-gray-300 rounded" href="#">
            <HomeIcon />
          </a>
          <a className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-300" href="#">
            <HomeIcon />
          </a>
        </div>
        <div className="flex flex-col items-center mt-2 border-t border-gray-300">
          <a className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-300" href="#">
            <HomeIcon />
          </a>
          <a className="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-gray-300" href="#">
            <HomeIcon />
          </a>
        </div>
        <a className="flex items-center justify-center w-16 h-16 mt-auto bg-gray-200 hover:bg-gray-300" href="#">
          <HomeIcon />
        </a>
      </div>
      <div className="sidebar" style={{ width: "25vw" }}>
        <div className="description p-4">
          <h2 className="mb-4">
            Notes
          </h2>

          <p>
            <small>
              To create area highlight hold (Alt), then click and
              drag.
            </small>
          </p>
        </div>

        <ul className="sidebar__highlights">
          {highlights.map((highlight, index) => (
            <li
              key={index}
              className="sidebar__highlight"
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
      </div>
    </>
  );
}