import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import PdfViewer from './components/custom/book_page/PdfViewer.tsx'
import MainPage from './components/custom/main_page/MainPage.tsx'
import TestPage from './components/custom/book_page/TestsPage.tsx'
import Page404 from './components/custom/misc/Page404.tsx'
import '../app/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/landing-page" element={<div>Landing Page Content Here</div>} />
        <Route path="/home" element={<MainPage userData={""} />} />
        <Route path="/pdfs/:pdfName/view" element={<PdfViewer />} />
        <Route path="/tests/:testName/edit" element={<TestPage />} />
        {/* Fallback route for 404 Not Found */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
