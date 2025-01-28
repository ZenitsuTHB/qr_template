// hooks/useLineActions.js
import { useCallback } from 'react';

const useLineActions = (setLines, api) => {
  const addLine = useCallback(
    (line) => {
      setLines((prevLines) => [...prevLines, line]);

      // Save the new line to API
      const saveLine = async () => {
        try {
          await api.post(`${window.baseDomain}api/tables`, line);
        } catch (error) {
          console.error('Error saving line:', error);
        }
      };

      saveLine();
    },
    [setLines, api]
  );

  const deleteLine = useCallback(
    (lineId) => {
      setLines((prevLines) => prevLines.filter((line) => line.id !== lineId));

      // Delete the line from API
      const deleteFromApi = async () => {
        try {
          await api.delete(`${window.baseDomain}api/tables/${lineId}`);
        } catch (error) {
          console.error('Error deleting line:', error);
        }
      };

      deleteFromApi();
    },
    [setLines, api]
  );

  return {
    addLine,
    deleteLine,
  };
};

export default useLineActions;
