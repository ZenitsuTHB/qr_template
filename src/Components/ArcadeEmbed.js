// src/components/ArcadeEmbed.jsx

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

export const ArcadeEmbed = forwardRef(function ArcadeEmbed(props, ref) {
  const arcadeIframeRef = useRef(null);

  useEffect(() => {
    function onArcadeIframeMessage(e) {
      if (e.origin !== 'https://demo.arcade.software' || !e.isTrusted) return;

      const arcadeIframe = arcadeIframeRef.current;
      if (!arcadeIframe || !arcadeIframe.contentWindow) return;

      if (e.data.event === 'arcade-init') {
        arcadeIframe.contentWindow.postMessage({ event: 'register-popout-handler' }, '*');
      }

      if (e.data.event === 'arcade-popout-open') {
        arcadeIframe.style.height = '100%';
        arcadeIframe.style.zIndex = '2147483647';
      }

      if (e.data.event === 'arcade-popout-close') {
        arcadeIframe.style.height = '0';
        arcadeIframe.style.zIndex = 'auto';
      }
    }

    window.addEventListener('message', onArcadeIframeMessage);

    const arcadeIframe = arcadeIframeRef.current;
    if (arcadeIframe && arcadeIframe.contentWindow) {
      arcadeIframe.contentWindow.postMessage({ event: 'register-popout-handler' }, '*');
    }

    return () => {
      if (arcadeIframe && arcadeIframe.contentWindow) {
        arcadeIframe.contentWindow.postMessage({ event: 'unregister-popout-handler' }, '*');
      }

      window.removeEventListener('message', onArcadeIframeMessage);
    };
  }, []);

  // Expose the openArcade method to parent components
  useImperativeHandle(ref, () => ({
    openArcade() {
      const arcadeIframe = arcadeIframeRef.current;
      if (arcadeIframe && arcadeIframe.contentWindow) {
        arcadeIframe.contentWindow.postMessage({ event: 'request-popout-open' }, '*');
      }
    },
  }));

  return (
    <iframe
      ref={arcadeIframeRef}
      src="https://demo.arcade.software/S1jhqbm2BX0qHX49DvVj?embed&embed_custom&show_copy_link=true"
      title="Mateza Booking 4.0"
      frameBorder="0"
      loading="lazy"
      allowFullScreen
      allow="clipboard-write"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: 0,
        colorScheme: 'light',
        transition: 'height 0.3s ease, z-index 0.3s ease',
      }}
    />
  );
});
