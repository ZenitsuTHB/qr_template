// src/hooks/useCanvasItems.js

import { useState, useEffect, useRef } from 'react';
import useApi from '../../../Hooks/useApi.js';

const useCanvasItems = (triggerNotification) => {
  const [canvasItems, setCanvasItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const previousCanvasItemsRef = useRef(null);
  const api = useApi();

  useEffect(() => {
    const fetchCanvasItems = async () => {
      try {
        console.log("Fields GET");
        const response = await api.get(`${window.baseDomain}api/fields/`);
        console.log('Raw data received from server:', response);

        let data = response || [];
        let parsedData;

        if (Array.isArray(data)) {
          parsedData = data;
        } else if (typeof data === 'object' && data !== null) {
          parsedData = Object.values(data);
          console.log('Converted object data to array:', parsedData);
        } else {
          parsedData = [];
        }

        // Filter out any empty objects and ensure each item has an 'id'
        parsedData = parsedData.filter(item => item && item.id && !item.id.startsWith('default-'));

        setCanvasItems(parsedData);
        previousCanvasItemsRef.current = parsedData;
        setLoading(false);
      } catch (err) {
        console.error('Error fetching canvas items:', err);
        setError('Error fetching canvas items');
        setLoading(false);
      }
    };

    fetchCanvasItems();
  }, [api]);

  const updateCanvasItemsAPI = (newCanvasItems) => {
    if (JSON.stringify(previousCanvasItemsRef.current) !== JSON.stringify(newCanvasItems)) {
      const updateFields = async () => {
        try {
          console.log('Updating fields on server with:', newCanvasItems);
          await api.put(`${window.baseDomain}api/fields/`, newCanvasItems);
          console.log('Fields updated successfully');
        } catch (err) {
          console.error('Error updating fields:', err);
          const errorCode = err.response?.status || 'unknown';
          if (triggerNotification) {
            triggerNotification(`Fout bij opslaan. Code: ${errorCode}`, 'error');
          }
        }
      };

      updateFields();
      previousCanvasItemsRef.current = newCanvasItems;
    }
  };

  return { canvasItems, setCanvasItems, loading, error, updateCanvasItemsAPI };
};

export default useCanvasItems;
