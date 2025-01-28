// src/Components/BannerUploadComponent.jsx

import React, { useState, useEffect, useRef } from 'react';
import useApi from '../../../Hooks/useApi.js';
import { FaImage } from 'react-icons/fa';
import useNotification from '../../../Components/Notification/index.js';

const BannerUploadComponent = () => {
  const [bannerUrl, setBannerUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const restaurantId = localStorage.getItem('username');
  const bannerImageUrl = `https://mateza-cloud-storage.ams3.digitaloceanspaces.com/email/banner/${restaurantId}`;
  const [isDragging, setIsDragging] = useState(false);
  const api = useApi();
  const fileInputRef = useRef(null);
  const { triggerNotification, NotificationComponent } = useNotification();

  useEffect(() => {
    // Attempt to load the image
    const img = new Image();
    img.src = bannerImageUrl;
    img.onload = () => {
      setBannerUrl(bannerImageUrl);
      setIsLoading(false);
    };
    img.onerror = () => {
      setBannerUrl('');
      setIsLoading(false);
    };
  }, [bannerImageUrl]);

  const handleFileUpload = async (file) => {
    // Validate file type
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      triggerNotification(
        'Ongeldig bestandstype',
        'error'
      );
      return;
    }

    // Validate file size (max 2 MB)
    const maxSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxSize) {
      triggerNotification(
        'Bestand is te groot',
        'error'
      );
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post(
        `${window.baseDomain}api/upload-image`,
        formData
      );

      // After successful upload, update the bannerUrl to trigger re-render
      setBannerUrl(bannerImageUrl + '?' + new Date().getTime()); // Add timestamp to prevent caching
      triggerNotification('Afbeelding geüpload', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);

      if (error.response && error.response.data && error.response.data.error) {
        triggerNotification(
          `Fout bij uploaden: ${error.response.data.error}`,
          'error'
        );
      } else {
        triggerNotification(
          'Fout bij uploaden',
          'error'
        );
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="banner-upload-container">
      <style>
        {`
          .banner-upload-container {
            position: relative;
            width: 100%;
            max-width: 800px;
            margin: 0 auto 20px auto;
            height: 150px; /* Set fixed height */
            border: 1px dashed gray;
            border-radius: 8px;
            overflow: hidden;
            background-color: #f9f9f9;
            cursor: pointer;
          }

          .banner-upload-container .banner-image {
            width: 100%;
            height: 150px; /* Fixed height */
            object-fit: cover; /* Maintain aspect ratio, cover the container */
            display: block;
          }

          .banner-upload-container .empty-banner {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            transition: background-color 0.3s;
            color: white; /* Ensure text is white when no image is present */
          }

          .banner-upload-container .empty-banner.dragging {
            background-color: #e9e9e9;
          }

          .banner-upload-container .empty-banner p {
            margin-top: 8px;
            font-weight: bold;
            color: white;
            text-shadow: 0 0 5px rgba(0,0,0,0.5);
          }

          .banner-upload-container .empty-banner input {
            display: none;
          }

          .banner-upload-container .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent dark overlay */
            color: white;

            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s;
          }

          .banner-upload-container:hover .overlay {
            opacity: 1;
          }

          .banner-upload-container .overlay .message {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .banner-upload-container .overlay .message p {
            margin-top: 8px;
            font-weight: bold;
            color: white !important; /* Explicitly set color to white */
          }

          .banner-upload-container .overlay svg {
            color: white !important;
          }

          .banner-upload-container .upload-instructions {
            text-align: center;
            margin-bottom: 10px;
            font-weight: bold;
          }
        `}
      </style>

      {/* Notification Component */}
      <NotificationComponent />

      {/* Instruction Text */}
      <p className="upload-instructions">
        Upload uw bestand in dit vak. Alleen .png, .jpg en .webp afbeeldingen zijn toegestaan. (max. 2mb)
      </p>

      {isLoading ? (
        <div className="empty-banner">
          <FaImage size={48} />
          <p>Sleep uw banner hier...</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
          />
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {bannerUrl ? (
            <img src={bannerUrl} alt="Banner" className="banner-image" />
          ) : (
            <div className={`empty-banner ${isDragging ? 'dragging' : ''}`}>
              <FaImage size={48} />
              <p>Sleep uw banner hier...</p>
            </div>
          )}
          {/* Overlay for editing */}
          <div className="overlay">
            <FaImage size={48} />
            <div className="message">
              <p>Verander uw banner door te klikken of te slepen</p>
            </div>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
      )}
    </div>
  );
};

export default BannerUploadComponent;
