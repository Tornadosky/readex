import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import MainPage from './components/custom/main_page/MainPage.tsx';
import TestPage from './components/custom/book_page/tests/TestsPage.tsx';
import Page404 from './components/custom/misc/Page404.tsx';
import LayoutWithSidebar from './components/custom/book_page/LayoutWithSidebar.tsx';
import '../app/globals.css';

import type { IHighlight } from "./components/custom/book_page/react-pdf-highlighter";
import { testHighlights as _testHighlights } from "./components/custom/book_page/test-highlights";
import PdfViewerWrapper from './components/custom/book_page/PdfViewer.tsx';

function AppWrapper() {
  const PRIMARY_PDF_URL = "https://arxiv.org/pdf/1708.08021.pdf";
  const SECONDARY_PDF_URL = "https://arxiv.org/pdf/1604.02480.pdf";
  const searchParams = new URLSearchParams(document.location.search);
  const initialUrl = searchParams.get("url") || PRIMARY_PDF_URL;
  const testHighlights: Record<string, Array<IHighlight>> = _testHighlights;

  const [highlights, setHighlights] = useState<IHighlight[]>(testHighlights[initialUrl] ? [...testHighlights[initialUrl]] : []);
  const [url, setUrl] = useState(initialUrl);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resetHighlights = () => {
    setHighlights([]);
  };

  const toggleDocument = () => {
    const newUrl = url === PRIMARY_PDF_URL ? SECONDARY_PDF_URL : PRIMARY_PDF_URL;
    setUrl(newUrl);
    setHighlights(_testHighlights[newUrl] ? [..._testHighlights[newUrl]] : []);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/landing-page" element={<div>Landing Page Content Here</div>} />
        <Route element={<LayoutWithSidebar
          highlights={highlights}
          resetHighlights={resetHighlights}
          toggleDocument={toggleDocument}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />}>
          <Route path="/home" element={<MainPage isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />} />
          <Route path="/pdfs/:pdfId/view" element={<PdfViewerWrapper highlights={highlights} setHighlights={setHighlights} />} />
          <Route path="/tests/:testId/edit" element={<TestPage isSolving={false} />} />
          <Route path="/tests/:testId/play" element={<TestPage isSolving={true} />} />
        </Route>
        {/* Fallback route for 404 Not Found */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  );
}

// Render the AppWrapper instead of directly setting up Routes in ReactDOM.createRoot
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>,
);
