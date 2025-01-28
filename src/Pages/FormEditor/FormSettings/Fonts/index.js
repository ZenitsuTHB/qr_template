// src/components/FormSettings/Fonts.jsx

import React, { useState, useEffect, forwardRef, useImperativeHandle, useRef, useMemo } from 'react';
import useApi from '../../../../Hooks/useApi';
import useNotification from '../../../../Components/Notification/index';
import { sansSerifFonts, serifFonts, fontWeights } from './fontsConfig';
import FontCategorySelector from './FontSelector';
import useDynamicFontLoader from '../../../../Hooks/useFontLoader';
import './css/fonts.css';

const Fonts = forwardRef((props, ref) => {
  const defaultFonts = {
    titleFont: { font: 'Poppins', weight: '400' },
    subtitleFont: { font: 'Poppins', weight: '400' },
    labelFont: { font: 'Poppins', weight: '400' },
    buttonFont: { font: 'Poppins', weight: '400' },
  };

  const resetFonts = defaultFonts;

  const [fontsState, setFontsState] = useState(defaultFonts);
  const [initialFontsState, setInitialFontsState] = useState(defaultFonts);
  const { triggerNotification, NotificationComponent } = useNotification();
  const api = useApi();

  const isIframe = typeof window !== 'undefined' && window.isIframe;

  const saveTimeoutRef = useRef(null);
  const expiryTimeRef = useRef(null);

  const fontCategories = [
    { key: 'titleFont', label: 'Titel' },
    { key: 'subtitleFont', label: 'Subtitel' },
    { key: 'labelFont', label: 'Tekst' },
    { key: 'buttonFont', label: 'Knoppen' },
  ];

  const fontLabels = {
    Montserrat: '(populair)',
    Comfortaa: '(aanbevolen)',
  };

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        const endpoint = `${window.baseDomain}api/fonts/`;
        console.log("Fonts GET");
        const response = await api.get(endpoint);

        if (response && Object.keys(response).length > 0) {
          const fetchedFonts = response;
          const transformedFonts = {};

          for (const key of Object.keys(fetchedFonts)) {
            const fontValue = fetchedFonts[key];
            if (typeof fontValue === 'string') {
              transformedFonts[key] = { font: fontValue, weight: '400' };
            } else if (fontValue && typeof fontValue === 'object') {
              transformedFonts[key] = fontValue;
            } else {
              transformedFonts[key] = defaultFonts[key];
            }
          }
          setFontsState(transformedFonts);
          setInitialFontsState(transformedFonts);
        } else {
          setFontsState(defaultFonts);
          setInitialFontsState(defaultFonts);
        }
      } catch (error) {
        console.error('Error fetching fonts:', error);
        triggerNotification('Fout bij het ophalen van lettertypes.', 'error');
        setFontsState(defaultFonts);
        setInitialFontsState(defaultFonts);
      }
    };

    fetchFonts();
  }, [api]);

  useDynamicFontLoader(fontsState);

  const handleFontSelect = (categoryKey, font) => {
    const availableWeights = fontWeights[font] || ['400'];
    const currentWeight = fontsState[categoryKey]?.weight || '400';
    const newWeight = availableWeights.includes(currentWeight) ? currentWeight : availableWeights[0];

    setFontsState((prev) => ({
      ...prev,
      [categoryKey]: { font: font, weight: newWeight },
    }));
  };

  const handleWeightSelect = (categoryKey, weight) => {
    setFontsState((prev) => ({
      ...prev,
      [categoryKey]: { ...prev[categoryKey], weight },
    }));
  };

  const handleSave = async () => {
    try {
      const endpoint = `${window.baseDomain}api/fonts/`;
      await api.put(endpoint, fontsState);
      triggerNotification('Lettertypes aangepast', 'success');
      setInitialFontsState(fontsState);
    } catch (error) {
      console.error('Error saving fonts:', error);
      const errorCode = error.response?.status || 'unknown';
      triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
      throw error; // Re-throw error to handle in parent
    }
  };

  const handleReset = async () => {
    try {
      const endpoint = `${window.baseDomain}api/fonts/`;
      await api.put(endpoint, resetFonts);
      setFontsState(resetFonts);
      triggerNotification('Lettertypes gereset naar standaard', 'success');
      setInitialFontsState(resetFonts);
    } catch (error) {
      console.error('Error resetting fonts:', error);
      const errorCode = error.response?.status || 'unknown';
      triggerNotification(`Fout bij resetten. Code: ${errorCode}`, 'error');
    }
  };

  const isDirty = useMemo(
    () => JSON.stringify(fontsState) !== JSON.stringify(initialFontsState),
    [fontsState, initialFontsState]
  );

  useImperativeHandle(ref, () => ({
    isDirty,
    handleSave,
  }), [isDirty, handleSave]);

  useEffect(() => {
    if (isIframe && isDirty) {
      const currentTime = Date.now();
      if (saveTimeoutRef.current) {
        // Timer is running
        // Increase expiryTime by 2000 ms
        expiryTimeRef.current += 2000;
      } else {
        // No timer running
        expiryTimeRef.current = currentTime + 5000; // 5 seconds from now
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
  }, [fontsState, isIframe, isDirty, handleSave]);

  return (
    <div className="fonts-container">
      <NotificationComponent />
      {fontCategories.map(({ key, label }) => (
        <FontCategorySelector
          key={key}
          categoryKey={key}
          label={label}
          fontsState={fontsState}
          defaultFonts={defaultFonts}
          handleFontSelect={handleFontSelect}
          handleWeightSelect={handleWeightSelect}
          sansSerifFonts={sansSerifFonts}
          serifFonts={serifFonts}
          fontLabels={fontLabels}
        />
      ))}

      {!isIframe && (
        <>
          <button type="button" className="secondary-button-style-3" onClick={handleReset}>
            Reset naar Standaard
          </button>
          <button type="submit" className="button-style-3" onClick={handleSave} disabled={!isDirty}>
            Opslaan
          </button>
        </>
      )}
    </div>
  );
});

export default Fonts;
