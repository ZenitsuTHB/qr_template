// src/utils/responsiveStyles.js

/**
 * Applies or removes responsive CSS classes based on the container's width.
 *
 * @param {React.RefObject} containerRef - The ref to the container element.
 */
export const applyResponsiveStyles = (containerRef) => {
	const container = containerRef.current;
  
	if (container) {
	  const containerWidth = container.offsetWidth;
	  const palette = container.querySelector('.palette');
	  const editorContainer = container.querySelector('.editor-container');
	  const canvas = container.querySelector('.canvas');
  
	  if (containerWidth <= 900) {
		palette?.classList.add('palette-responsive');
		editorContainer?.classList.add('editor-container-responsive');
		canvas?.classList.add('canvas-responsive');
	  } else {
		palette?.classList.remove('palette-responsive');
		editorContainer?.classList.remove('editor-container-responsive');
		canvas?.classList.remove('canvas-responsive');
	  }
	}
  };
  