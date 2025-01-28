// src/Pages/UploadPdf/index.js

import React, { useState, useRef, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import { QRCodeCanvas } from 'qrcode.react'; 
import './css/pdf.css';

const PdfUpload = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  const [pdfFile, setPdfFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const [qrColor, setQrColor] = useState('#000000');
  const [showColorEditor, setShowColorEditor] = useState(false);

  const [restaurantName, setRestaurantName] = useState(() => {
    // Load stored restaurantName from localStorage if available
    return localStorage.getItem('restaurantName') || '';
  });

  const qrCanvasRef = useRef(null);
  const qrDownloadRef = useRef(null);

  useEffect(() => {
    // Load stored pdfUrl from localStorage if available
    const storedPdfUrl = localStorage.getItem('pdfUrl');
    if (storedPdfUrl) {
      setPdfUrl(storedPdfUrl);
    }
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setPdfFile(file);
      } else {
        triggerNotification('Alleen PDF bestanden zijn toegestaan.', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pdfFile) {
      triggerNotification('Selecteer eerst een PDF bestand.', 'error');
      return;
    }

    if (!restaurantName.trim()) {
      triggerNotification('Vul een restaurantnaam in.', 'error');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    try {
      const response = await api.post(`${window.baseDomain}api/upload-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response) {
        const restaurantId = localStorage.getItem('username'); // Existing logic for ID
        const encodedName = encodeURIComponent(restaurantName.trim());
        const menuUrl = `http://menu.reservaties.net/?restaurantId=${restaurantId}&restaurantName=${encodedName}`;

        // Save URL and restaurantName to localStorage
        setPdfUrl(menuUrl);
        localStorage.setItem('pdfUrl', menuUrl);
        localStorage.setItem('restaurantName', restaurantName.trim());

        triggerNotification('PDF succesvol geüpload.', 'success');
      } else {
        triggerNotification('Fout bij het uploaden van de PDF.', 'error');
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      triggerNotification('Fout bij het uploaden van de PDF.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadQR = () => {
    if (!qrDownloadRef.current) return;
    const canvas = qrDownloadRef.current.querySelector('canvas');
    if (!canvas) return;

    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleViewLink = () => {
    if (!pdfUrl) return;
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="pdf-page">
      <NotificationComponent />
      <div className="pdf-page__container">
        {/* Left side: Upload Form */}
        <form className="pdf-page__form" onSubmit={handleSubmit}>
          <div className="pdf-page__form-group">
            <label>Restaurant Naam</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="pdf-page__input"
            />
          </div>
          <div className="pdf-page__form-group">
            <label>Kies een PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="pdf-page__input"
            />
          </div>
          <button type="submit" className="button-style-3" disabled={isUploading}>
            {isUploading ? 'Bezig met uploaden...' : 'Uploaden'}
          </button>
        </form>

        {/* Right side */}
        <div className="pdf-page__content">
          <div className="pdf-page__qr-section">
            <h3>QR Code</h3>
            {pdfUrl ? (
              <>
                {/* Visible QR Code (small, no margin) */}
                <div className="pdf-page__qr-container" ref={qrCanvasRef}>
                  <QRCodeCanvas
                    value={pdfUrl}
                    size={150}
                    fgColor={qrColor}
                    bgColor="#ffffff"
                    includeMargin={false}
                    className="pdf-page__qr-code"
                  />
                </div>

                {/* Hidden larger QR code for high-res download with white margin */}
                <div style={{ display: 'none' }} ref={qrDownloadRef}>
                  <QRCodeCanvas
                    value={pdfUrl}
                    size={800}
                    fgColor={qrColor}
                    bgColor="#ffffff"
                    includeMargin={true}
                  />
                </div>

                {/* Button Group */}
                <div className="pdf-page__button-group">
                  <button onClick={handleDownloadQR} className="pdf-page__download-button">
                    Download QR Code
                  </button>
                  <button
                    className="pdf-page__edit-color-button"
                    onClick={() => setShowColorEditor(!showColorEditor)}
                  >
                    Kleur Bewerken
                  </button>
                  <button
                    className="pdf-page__view-link-button"
                    onClick={handleViewLink}
                    disabled={!pdfUrl}
                  >
                    Bekijk Link
                  </button>

                  {showColorEditor && (
                    <div className="pdf-page__color-editor">
                      <h4>Pas QR Kleur aan</h4>
                      <input
                        type="color"
                        value={qrColor}
                        onChange={(e) => setQrColor(e.target.value)}
                        className="pdf-page__input pdf-page__color-picker"
                      />
                      <button
                        className="pdf-page__close-color-editor"
                        onClick={() => setShowColorEditor(false)}
                      >
                        Sluiten
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <p className="pdf-page__no-pdf">Upload een nieuwe pdf</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default withHeader(PdfUpload);
