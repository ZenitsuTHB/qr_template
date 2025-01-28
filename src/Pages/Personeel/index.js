// src/Pages/Personeel/index.js
import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import './css/personeel.css';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import PersoneelForm from './PersoneelForm';
import PersoneelList from './PersoneelList.js';

const Personeel = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  // State for the list of personeel
  const [personeels, setPersoneels] = useState([]);

  // Fetch the personeel at component mount
  useEffect(() => {
    const fetchPersoneel = async () => {
      try {
        const data = await api.get(window.baseDomain + 'api/personeel', { noCache: true });
        if (Array.isArray(data)) {
          setPersoneels(data);
        } else {
          setPersoneels([]);
        }
      } catch (error) {
        console.error('Error fetching personeel:', error);
        setPersoneels([]);
        triggerNotification('Fout bij het ophalen van personeel.', 'error');
      }
    };
    fetchPersoneel();
  }, [api, triggerNotification]);

  // Handler to refresh personeel
  const refreshPersoneel = async () => {
    try {
      const data = await api.get(window.baseDomain + 'api/personeel', { noCache: true });
      if (Array.isArray(data)) {
        setPersoneels(data);
      } else {
        setPersoneels([]);
      }
    } catch (error) {
      console.error('Error fetching personeel:', error);
      setPersoneels([]);
      triggerNotification('Fout bij het ophalen van personeel.', 'error');
    }
  };

  return (
    <div className="personeel-component">
      <NotificationComponent />
      <div className="personeel-component__container">
        <PersoneelForm
          api={api}
          triggerNotification={triggerNotification}
          refreshPersoneel={refreshPersoneel}
        />
        <PersoneelList
          personeels={personeels}
          api={api}
          triggerNotification={triggerNotification}
          refreshPersoneel={refreshPersoneel}
        />
      </div>
    </div>
  );
};

export default withHeader(Personeel);
