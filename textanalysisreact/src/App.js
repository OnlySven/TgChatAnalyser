import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import JsonUploader from './components/JsonUploader';
import AnalysisMenu from './components/AnalysisMenu';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<JsonUploader />} />
        <Route path="/analysis" element={<AnalysisMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
