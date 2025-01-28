// src/components/DragAndDropEditor/DragAndDropEditor.js

import React, { useState, useEffect, useRef } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import { FaMagic } from 'react-icons/fa';
import { DragDropContext } from 'react-beautiful-dnd';
import Palette from './DragAndDrop/Palette.js';
import Canvas from './DragAndDrop/Canvas.js';
import ThemeSelectorModal from './Theme/index.js';
import useNotification from '../../Components/Notification/index';
import { initialBlocks, defaultCanvasItems } from './defaultElements.js';

import { applyResponsiveStyles } from './Utils/responsiveStyles.js';
import useCanvasItems from './Hooks/fetchCanvas.js';

const DragAndDropEditor = () => {
  const [blocks] = useState(initialBlocks);
  const [dropPosition, setDropPosition] = useState(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const formEditingPageRef = useRef(null);

  const { triggerNotification, NotificationComponent } = useNotification();
  const { canvasItems, setCanvasItems, loading, error, updateCanvasItemsAPI } = useCanvasItems(triggerNotification);

  const [allCanvasItems, setAllCanvasItems] = useState([...defaultCanvasItems, ...canvasItems]);

  useEffect(() => {
    setAllCanvasItems([...defaultCanvasItems, ...canvasItems]);
  }, [canvasItems]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      applyResponsiveStyles(formEditingPageRef);
    });

    if (formEditingPageRef.current) {
      observer.observe(formEditingPageRef.current);
      applyResponsiveStyles(formEditingPageRef);
    }

    return () => {
      if (formEditingPageRef.current) {
        observer.unobserve(formEditingPageRef.current);
      }
    };
  }, []);

  const handleOnDragEnd = (result) => {
    setDropPosition(null);

    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === 'Palette' && destination.droppableId === 'Canvas') {
      const item = blocks.find(block => block.id === result.draggableId);
      if (!item) return;

      const newItem = {
        ...item,
        id: `${item.id}-${Date.now()}`,
        placeholder: '',
        required: false,
      };

      const newAllCanvasItems = Array.from(allCanvasItems);
      newAllCanvasItems.splice(destination.index, 0, newItem);
      setAllCanvasItems(newAllCanvasItems);
      updateCanvasItemsAPI(newAllCanvasItems.filter(item => !item.id.startsWith('default-')));
    }
    else if (source.droppableId === 'Canvas' && destination.droppableId === 'Canvas') {
      const newAllCanvasItems = Array.from(allCanvasItems);
      const [movedItem] = newAllCanvasItems.splice(source.index, 1);
      newAllCanvasItems.splice(destination.index, 0, movedItem);
      setAllCanvasItems(newAllCanvasItems);
      updateCanvasItemsAPI(newAllCanvasItems.filter(item => !item.id.startsWith('default-')));
    }
  };

  const handleOnDragUpdate = (update) => {
    const { destination } = update;
    if (!destination) {
      setDropPosition(null);
      return;
    }
    setDropPosition(destination.index);
  };

  const handleDelete = (id) => {
    if (id.startsWith('default-')) return;

    const newCanvasItems = allCanvasItems.filter(item => item.id !== id);
    setAllCanvasItems(newCanvasItems);
    updateCanvasItemsAPI(newCanvasItems.filter(item => !item.id.startsWith('default-')));
  };

  console.log('All Canvas Items before rendering:', allCanvasItems);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="form-editing-page" ref={formEditingPageRef}>
      <NotificationComponent />
      <div className="editor-container">
        <DragDropContext onDragEnd={handleOnDragEnd} onDragUpdate={handleOnDragUpdate}>
          <Palette blocks={blocks} />
          <Canvas
            items={allCanvasItems}
            setItems={setAllCanvasItems}
            dropPosition={dropPosition}
            onDelete={handleDelete}
          />
        </DragDropContext>
      </div>
      <button className="button-style-2 themes-button" onClick={() => setShowThemeModal(true)}>
        <FaMagic className="button-style-2-icon icon" />
        Banner Kiezen
      </button>
      {showThemeModal && (
        <ThemeSelectorModal
          onClose={() => setShowThemeModal(false)}
          onSuccess={() => triggerNotification('Thema aangepast', 'success')}
        />
      )}
    </div>
  );
};

export default withHeader(DragAndDropEditor);
