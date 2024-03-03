import { useState } from 'react';
import { Sidebar } from './Sidebar'; 
import './style.css';

import type { IHighlight } from "./react-pdf-highlighter";
import { testHighlights as _testHighlights } from "./test-highlights";
import QuizEditor from './QuizEditor';
const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";

const searchParams = new URLSearchParams(document.location.search);

const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;


const TestPage = () => {
  const [highlights, setHighlights] = useState<IHighlight[]>(testHighlights[initialUrl]
    ? [...testHighlights[initialUrl]]
    : [],);
  const [url, setUrl] = useState(initialUrl);

  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleDocument = () => {
    const newUrl = url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;

    setUrl(newUrl);
    setHighlights(testHighlights[newUrl] ? [...testHighlights[newUrl]] : []);
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        <Sidebar 
            highlights={highlights}
            resetHighlights={resetHighlights}
            toggleDocument={toggleDocument}
        />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <QuizEditor />
        </div>
      </div>
    </div>
  );
};

export default TestPage;