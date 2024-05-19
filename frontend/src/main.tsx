import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import MainPage from './components/custom/main_page/MainPage.tsx';
import TestPage from './components/custom/book_page/tests/TestsPage.tsx';
import Page404 from './components/custom/misc/Page404.tsx';
import LayoutWithSidebar from './components/custom/book_page/LayoutWithSidebar.tsx';
import '../app/globals.css';

import { testHighlights as _testHighlights } from "./components/custom/book_page/test-highlights";
import PdfViewerWrapper from './components/custom/book_page/PdfViewer.tsx';

function AppWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sectionIdModal, setSectionIdModal] = useState<number | null>(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/landing-page" element={<div>Landing Page Content Here</div>} />
        <Route element={<LayoutWithSidebar
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          sectionIdModal={sectionIdModal}
          setSectionIdModal={setSectionIdModal}
        />}>
          <Route path="/home" element={
            <MainPage 
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
              sectionIdModal={sectionIdModal}
              setSectionIdModal={setSectionIdModal}
            />}
          />
          <Route path="/pdfs/:pdfId/view" element={<PdfViewerWrapper />} />
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
