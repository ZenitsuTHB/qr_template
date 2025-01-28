// src/components/FormSettings/Colors.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import useNotification from '../../../../Components/Notification/index';
import ColorPicker from './ColorPicker';
import BackgroundTypeSelector from './BackgroundTypeSelector';
import useApi from '../../../../Hooks/useApi.js';

const Colors = forwardRef((props, ref) => {
  const { triggerNotification, NotificationComponent } = useNotification();

  const defaultAppearanceData = {
    backgroundType: 'solid',
    backgroundColor: '#000',
    gradientStartColor: '#FFFFFF',
    gradientEndColor: '#000000',
    animationType: 'none',
    widgetBackgroundColor: '#000000',
    widgetTextColor: '#FFFFFF',
    textColor: '#000000',
    containerColor: '#FFFFFF',
    buttonColor: '#000000',
    buttonTextColor: '#FFFFFF',
  };

  const [appearanceData, setAppearanceData] = useState(defaultAppearanceData);
  const [initialAppearanceData, setInitialAppearanceData] = useState(defaultAppearanceData);
  const [loading, setLoading] = useState(true);

  const isIframe = typeof window !== 'undefined' && window.isIframe;

  const saveTimeoutRef = useRef(null);
  const expiryTimeRef = useRef(null);

  const api = useApi();

  useEffect(() => {
    const fetchColors = async () => {
      try {
        console.log("Colors GET");
        const response = await api.get(`${window.baseDomain}api/colors/`);
        const data = response || {};
        const mergedData = { ...defaultAppearanceData, ...data };
        const missingFields = Object.keys(defaultAppearanceData).filter(
          (key) => !(key in data)
        );
        if (missingFields.length > 0) {
          console.warn('Missing color fields from server response:', missingFields);
        }

        setAppearanceData(mergedData);
        setInitialAppearanceData(mergedData);
      } catch (err) {
        console.error('Error fetching colors:', err);
        setAppearanceData(defaultAppearanceData);
        setInitialAppearanceData(defaultAppearanceData);
      } finally {
        setLoading(false);
      }
    };

    fetchColors();
  }, [api]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAppearanceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBackgroundTypeChange = (backgroundType) => {
    setAppearanceData((prevData) => ({
      ...prevData,
      backgroundType,
    }));
  };

  const handleSave = async () => {
    try {
      await api.put(`${window.baseDomain}api/colors/`, appearanceData);
      triggerNotification('Kleuren aangepast', 'success');
      setInitialAppearanceData(appearanceData);
    } catch (err) {
      console.error('Error saving colors:', err);
      const errorCode = err.response?.status || 'unknown';
      triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
      throw err;
    }
  };

  const isDirty = useMemo(
    () => JSON.stringify(appearanceData) !== JSON.stringify(initialAppearanceData),
    [appearanceData, initialAppearanceData]
  );

  useImperativeHandle(ref, () => ({
    isDirty,
    handleSave,
  }));

  useEffect(() => {
    if (isIframe && isDirty) {
      const currentTime = Date.now();
      if (saveTimeoutRef.current) {
        expiryTimeRef.current += 2000;
      } else {
        expiryTimeRef.current = currentTime + 5000;
      }

      const delay = expiryTimeRef.current - currentTime;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await handleSave();
        } catch (error) {
        }
        saveTimeoutRef.current = null;
        expiryTimeRef.current = null;
      }, delay);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = null;
        expiryTimeRef.current = null;
      }
    };
  }, [appearanceData, isIframe, isDirty, handleSave]);

  const { backgroundType } = appearanceData;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="colors-container">
      <NotificationComponent />

      <BackgroundTypeSelector
        backgroundType={backgroundType}
        setBackgroundType={handleBackgroundTypeChange}
      />

      {backgroundType === 'solid' && (
        <ColorPicker
          label="Achtergrondkleur"
          name="backgroundColor"
          value={appearanceData.backgroundColor}
          onChange={handleChange}
        />
      )}

      {backgroundType === 'gradient' && (
        <>
          <ColorPicker
            label="Gradient Startkleur"
            name="gradientStartColor"
            value={appearanceData.gradientStartColor}
            onChange={handleChange}
          />
          <ColorPicker
            label="Gradient Eindkleur"
            name="gradientEndColor"
            value={appearanceData.gradientEndColor}
            onChange={handleChange}
          />
        </>
      )}

      <ColorPicker
        label="Widget Achtergrondkleur"
        name="widgetBackgroundColor"
        value={appearanceData.widgetBackgroundColor}
        onChange={handleChange}
      />
      <ColorPicker
        label="Widget Tekstkleur"
        name="widgetTextColor"
        value={appearanceData.widgetTextColor}
        onChange={handleChange}
      />

      <ColorPicker
        label="Tekstkleur"
        name="textColor"
        value={appearanceData.textColor}
        onChange={handleChange}
      />
      <ColorPicker
        label="Containerkleur"
        name="containerColor"
        value={appearanceData.containerColor}
        onChange={handleChange}
      />

      <ColorPicker
        label="Knopkleur"
        name="buttonColor"
        value={appearanceData.buttonColor}
        onChange={handleChange}
      />
      <ColorPicker
        label="Knoptekst kleur"
        name="buttonTextColor"
        value={appearanceData.buttonTextColor}
        onChange={handleChange}
      />

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

export default Colors;
