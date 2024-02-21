import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import PdfViewer from './components/custom/book_page/PdfViewer.tsx'
import MainPage from './components/custom/main_page/MainPage.tsx'
import '../app/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <MainPage userData={""} /> */}
    <PdfViewer />
  </React.StrictMode>,
)
