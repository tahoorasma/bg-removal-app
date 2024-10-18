import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setOriginalImage(URL.createObjectURL(event.target.files[0]));
    setProcessedImage(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post('http://127.0.0.1:8000/remove-background/', formData, {
        responseType: 'blob',
      });      
      const imageBlob = new Blob([response.data], { type: 'image/png' });
      const imageUrl = URL.createObjectURL(imageBlob);
      setProcessedImage(imageUrl);
    } catch (error) {
      console.error('Error removing background:', error);
      alert('Failed to remove background. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Background Removal App</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" disabled={!selectedFile || loading}>
          {loading ? 'Processing...' : 'Remove Background'}
        </button>
      </form>

      <div className="images">
        {originalImage && (
          <div>
            <h2>Original Image</h2>
            <img src={originalImage} alt="Original" />
          </div>
        )}
        {processedImage && (
          <div>
            <h2>Processed Image</h2>
            <img src={processedImage} alt="Processed" />
            <a href={processedImage} download="processed_image.png">
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
