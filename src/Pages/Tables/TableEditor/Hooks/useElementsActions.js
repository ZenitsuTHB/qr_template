// hooks/useElementActions.js
import { useCallback } from 'react';

const useElementActions = (
  setElements,
  setLines,
  floorPlanSize,
  nextTableNumber,
  setNextTableNumber,
  api
) => {
  const addElement = useCallback(
    (element) => {
      setElements((prevElements) => [...prevElements, element]);

      // Save the new element to API
      const saveElement = async () => {
        try {
          await api.post(`${window.baseDomain}api/tables`, element);
        } catch (error) {
          console.error('Error saving element:', error);
        }
      };

      if (element.type !== 'line') {
        saveElement();
      }
    },
    [setElements, api]
  );

  const updateElement = useCallback(
    (updatedElement) => {
      setElements((prevElements) =>
        prevElements.map((el) => (el.id === updatedElement.id ? updatedElement : el))
      );

      // Save the updated element to API
      const saveElement = async () => {
        try {
          if (updatedElement.type === 'line') {
            // Lines are handled separately
            return;
          }
          if (updatedElement._id) {
            // Existing table: use PUT request
            await api.put(`${window.baseDomain}api/tables/${updatedElement._id}`, updatedElement);
          } else {
            // New table: use POST request
            await api.post(`${window.baseDomain}api/tables`, updatedElement);
          }
        } catch (error) {
          console.error('Error updating element:', error);
        }
      };

      if (updatedElement.type !== 'line') {
        saveElement();
      }
    },
    [setElements, api]
  );

  const moveElement = useCallback((id, x, y) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id
          ? {
              ...el,
              x,
              y,
            }
          : el
      )
    );

    // Save the moved element to API
    const saveMove = async () => {
      try {
        const movedElement = { id, x, y };
        await api.put(`${window.baseDomain}api/tables/${id}`, movedElement);
      } catch (error) {
        console.error('Error moving element:', error);
      }
    };

    saveMove();
  }, [setElements, api]);

  const rotateElement = useCallback((id) => {
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === id
          ? {
              ...el,
              rotation: (el.rotation || 0) + 90, // Rotate by 90 degrees
            }
          : el
      )
    );

    // Save the rotated element to API
    const saveRotate = async () => {
      try {
        const rotatedElement = { rotation: 90 };
        await api.put(`${window.baseDomain}api/tables/${id}`, rotatedElement);
      } catch (error) {
        console.error('Error rotating element:', error);
      }
    };

    saveRotate();
  }, [setElements, api]);

  const duplicateElement = useCallback(
    (id) => {
      setElements((prevElements) => {
        const elementToDuplicate = prevElements.find((el) => el.id === id);
        if (!elementToDuplicate) return prevElements;
        const newId = Date.now();
        const newElement = {
          ...elementToDuplicate,
          id: newId,
          x: Math.min(
            elementToDuplicate.x + 20,
            floorPlanSize.width - elementToDuplicate.width
          ),
          y: Math.min(
            elementToDuplicate.y + 20,
            floorPlanSize.height - elementToDuplicate.height
          ),
          name:
            elementToDuplicate.type === 'table'
              ? `T${nextTableNumber}`
              : `${elementToDuplicate.subtype.charAt(0).toUpperCase() +
                  elementToDuplicate.subtype.slice(1)} Decoration ${newId}`,
          rotation: elementToDuplicate.rotation || 0,
        };

        if (elementToDuplicate.type === 'table') {
          newElement.tableNumber = nextTableNumber;
          setNextTableNumber((prev) => prev + 1);
        }

        // Save the duplicated element to API
        const saveDuplicate = async () => {
          try {
            await api.post(`${window.baseDomain}api/tables`, newElement);
          } catch (error) {
            console.error('Error duplicating element:', error);
          }
        };

        saveDuplicate();

        return [...prevElements, newElement];
      });
    },
    [setElements, floorPlanSize.width, floorPlanSize.height, nextTableNumber, setNextTableNumber, api]
  );

  const deleteElement = useCallback(
    (id) => {
      setElements((prevElements) => prevElements.filter((el) => el.id !== id));
      // Remove any lines connected to this element
      setLines((prevLines) => prevLines.filter((line) => line.from !== id && line.to !== id));

      // Delete the element from API
      const deleteFromApi = async () => {
        try {
          await api.delete(`${window.baseDomain}api/tables/${id}`);
        } catch (error) {
          console.error('Error deleting element:', error);
        }
      };

      deleteFromApi();
    },
    [setElements, setLines, api]
  );

  return {
    addElement,
    updateElement,
    moveElement,
    rotateElement,
    duplicateElement,
    deleteElement,
  };
};

export default useElementActions;
