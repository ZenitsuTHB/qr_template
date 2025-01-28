import { useEffect } from 'react';

const useDynamicFontLoader = (fontsState) => {
  useEffect(() => {
    const fontWeightMap = {};

    Object.values(fontsState)
      .filter(item => item && item.font)
      .forEach(({ font, weight }) => {
        if (!fontWeightMap[font]) {
          fontWeightMap[font] = new Set();
        }
        fontWeightMap[font].add(weight);
      });

    const fontsToImport = Object.entries(fontWeightMap).map(
      ([font, weightsSet]) => {
        const weightsArray = Array.from(weightsSet);
        return `family=${encodeURIComponent(font)}:wght@${weightsArray.join(
          ';'
        )}`;
      }
    );

    if (fontsToImport.length > 0) {
      const googleFontsUrl = `https://fonts.googleapis.com/css2?${fontsToImport.join(
        '&'
      )}&display=swap`;

      let linkElement = document.getElementById('dynamic-fonts-import');
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.id = 'dynamic-fonts-import';
        linkElement.rel = 'stylesheet';
        document.head.appendChild(linkElement);
      }
      linkElement.href = googleFontsUrl;
    }
  }, [fontsState]);
};

export default useDynamicFontLoader;
