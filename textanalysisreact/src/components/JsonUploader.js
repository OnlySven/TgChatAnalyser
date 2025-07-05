import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function JsonUploader() {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [folderName, setFolderName] = useState(''); // збереження папки
  const navigate = useNavigate();

  const handleFile = async (file) => {
    if (!file || file.type !== 'application/json') {
      setErrorMessage('Оберіть коректний JSON-файл');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    setFolderName('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5222/api/extractor/extractall', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error(`Помилка сервера: ${response.statusText}`);

      const data = await response.json();

      setSuccessMessage('✅ Файл успішно оброблено!');
      setFolderName(data.folder); // зберігаємо імʼя папки для навігації
    } catch (err) {
      setErrorMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f7fa'
      }}
    >
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => document.getElementById('hiddenFileInput').click()}
        style={{
          width: 260,
          minHeight: 120,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          backgroundColor: dragOver ? '#eef6ff' : '#f9f9f9',
          border: '2px dashed #888',
          borderRadius: 12,
          color: '#444',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
          padding: 16,
          boxShadow: '0 2px 12px #0001'
        }}
      >
        <div style={{ fontSize: 38, marginBottom: 8 }}>📁</div>
        <div style={{ fontSize: 14, marginBottom: 8 }}>
          Перетягніть JSON-файл сюди або натисніть для вибору
        </div>
        <input
          type="file"
          accept=".json"
          id="hiddenFileInput"
          style={{ display: 'none' }}
          onChange={handleInputChange}
        />
        {(loading || successMessage || errorMessage) && (
          <div style={{ marginTop: 14, textAlign: 'center', fontSize: 14 }}>
            {loading && <span>⏳ Обробка файлу...</span>}
            {successMessage && (
              <span style={{ color: 'green' }}>{successMessage}</span>
            )}
            {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}
          </div>
        )}
      </div>

      {/* Кнопка переходу */}
      {successMessage && folderName && (
        <button
          style={{
            marginTop: 24,
            padding: '8px 22px',
            fontSize: 15,
            borderRadius: 7,
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/analysis', { state: { folder: folderName } })}
        >
          Перейти до статистики
        </button>
      )}
    </div>
  );
}

export default JsonUploader;
