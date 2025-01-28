// src/components/FormSettings/Settings.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback, useRef } from 'react';
import useNotification from '../../../../Components/Notification/index.js';
import useApi from '../../../../Hooks/useApi.js';
import SettingsForm from './SettingsForm.js';
import ThemePreview from './ThemePreview.js';
import AlignmentSelector from './AlignmentSelector.js';
import BackgroundBlurSelector from './BackgroundBlurSelector.js';

const Settings = forwardRef((props, ref) => {
  const defaultSettings = {
    pageTitle: 'Reserveer Nu',
    generalNotification: '',
    alignment: 'fullScreenPicture', // Default alignment
    backgroundBlur: 'blurBackground', // Default background blur
  };

  const [formData, setFormData] = useState(defaultSettings);
  const [initialFormData, setInitialFormData] = useState(defaultSettings);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const { triggerNotification, NotificationComponent } = useNotification();
  const api = useApi();

  const isIframe = typeof window !== 'undefined' && window.isIframe;

  const saveTimeoutRef = useRef(null);
  const expiryTimeRef = useRef(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        console.log("Settings GET");
        const settingsResponse = await api.get(`${window.baseDomain}api/settings/`);
        if (settingsResponse) {
          const data = settingsResponse;
          const newFormData = {
            pageTitle: data.pageTitle || defaultSettings.pageTitle,
            generalNotification: data.generalNotification || '',
            alignment: data.alignment || defaultSettings.alignment,
            backgroundBlur: data.backgroundBlur || defaultSettings.backgroundBlur, // Added line
          };
          setFormData(newFormData);
          setInitialFormData(newFormData);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        setFormData(defaultSettings);
        setInitialFormData(defaultSettings);
      }
    };

    const fetchTheme = async () => {
      try {
        console.log("Theme GET");
        const themeResponse = await api.get(`${window.baseDomain}api/theme/`);
        setSelectedTheme(themeResponse);
      } catch (error) {
        console.error('Error fetching theme:', error);
      }
    };

    fetchSettings();
    fetchTheme();
  }, [api]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }, []);

  const setAlignment = useCallback((alignmentValue) => {
    setFormData((prevData) => ({
      ...prevData,
      alignment: alignmentValue,
    }));
  }, []);

  const handleSave = useCallback(async () => {
    try {
      await api.put(`${window.baseDomain}api/settings/`, formData);
      triggerNotification('Instellingen aangepast', 'success');
      setInitialFormData(formData);
    } catch (error) {
      console.error('Error saving settings:', error);
      const errorCode = error.response?.status || 'unknown';
      triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
      throw error; // Re-throw the error to handle it in the parent
    }
  }, [api, formData, triggerNotification]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'pageTitle' && value.trim() === '') {
      setFormData((prevData) => ({
        ...prevData,
        pageTitle: 'Reserveer Nu',
      }));
    }
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(initialFormData),
    [formData, initialFormData]
  );

  useImperativeHandle(
    ref,
    () => ({
      isDirty,
      handleSave,
    }),
    [isDirty, handleSave]
  );

  useEffect(() => {
    if (isIframe && isDirty) {
      const currentTime = Date.now();
      if (saveTimeoutRef.current) {
        // Timer is running
        // Increase expiryTime by 2000 ms
        expiryTimeRef.current += 3000;
      } else {
        // No timer running
        expiryTimeRef.current = currentTime + 1500; // 5 seconds from now
      }

      const delay = expiryTimeRef.current - currentTime;

      // Clear existing timer
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Start new timer
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await handleSave();
        } catch (error) {
          // Handle error if needed
        }
        saveTimeoutRef.current = null;
        expiryTimeRef.current = null;
      }, delay);
    }

    // Clean up on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
        expiryTimeRef.current = null;
      }
    };
  }, [formData, isIframe, isDirty, handleSave]);

  return (
    <div>
      <NotificationComponent />

      <SettingsForm
        formData={formData}
        handleChange={handleChange}
        handleBlur={handleBlur}
      />

      <AlignmentSelector
        alignment={formData.alignment}
        setAlignment={setAlignment}
      />

      <BackgroundBlurSelector
        backgroundBlur={formData.backgroundBlur}
        setBackgroundBlur={(value) =>
          setFormData((prevData) => ({ ...prevData, backgroundBlur: value }))
        }
      />

      {/* Conditionally render ThemePreview */}
      {formData.alignment !== 'fullScreenColor' && (
        <ThemePreview
          selectedTheme={selectedTheme}
          setSelectedTheme={setSelectedTheme}
          triggerNotification={triggerNotification}
        />
      )}

      {!isIframe && (
        <button
          type="button"
          className="button-style-3"
          onClick={handleSave}
          disabled={!isDirty}
        >
          Opslaan
        </button>
      )}
    </div>
  );
});

export default Settings;
