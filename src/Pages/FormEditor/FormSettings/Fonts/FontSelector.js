// src/components/FormSettings/FontCategorySelector.jsx

import React from 'react';
import { fontWeights } from './fontsConfig';
import './css/fonts.css';

const FontCategorySelector = ({
  categoryKey,
  label,
  fontsState,
  defaultFonts,
  handleFontSelect,
  handleWeightSelect,
  sansSerifFonts,
  serifFonts,
  fontLabels,
}) => {
  const selectedFont = fontsState[categoryKey]?.font || defaultFonts[categoryKey].font;
  const selectedWeight = fontsState[categoryKey]?.weight || defaultFonts[categoryKey].weight;

  const availableWeights = fontWeights[selectedFont] || ['400'];

  return (
    <div className="form-group">
      <label>{label}:</label>
      <div className="selectors-container">
        <div className="font-selector">
          <select
            value={selectedFont}
            onChange={(e) => handleFontSelect(categoryKey, e.target.value)}
          >
            <optgroup label="Modern">
              {sansSerifFonts.map((font) => (
                <option key={font} value={font}>
                  {font} {fontLabels[font] || ''}
                </option>
              ))}
            </optgroup>
            <optgroup label="Klassiek">
              {serifFonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        <div className="weight-selector">
          <select
            value={selectedWeight}
            onChange={(e) => handleWeightSelect(categoryKey, e.target.value)}
          >
            {availableWeights.map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div
        className="font-preview"
        style={{ fontFamily: `'${selectedFont}', sans-serif`, fontWeight: selectedWeight }}
      >
        Voorbeeld tekst in {selectedFont} ({selectedWeight})
      </div>
    </div>
  );
};

export default FontCategorySelector;
