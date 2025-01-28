// src/Pages/Mededeling/index.js

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import './css/mededeling.css';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import MededelingForm from './MededelingForm';
import MededelingList from './MededelingList';

const Mededeling = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  // State for the list of mededelingen
  const [mededelingen, setMededelingen] = useState([]);

  // Fetch the mededelingen at component mount
  useEffect(() => {
    const fetchMededelingen = async () => {
      try {
        const data = await api.get(`${window.baseDomain}api/mededeling`, { noCache: true });
        if (Array.isArray(data)) {
          setMededelingen(data);
        } else {
          setMededelingen([]);
        }
      } catch (error) {
        console.error('Error fetching mededelingen:', error);
        setMededelingen([]);
        triggerNotification('Fout bij het ophalen van mededelingen.', 'error');
      }
    };
    fetchMededelingen();
  }, [api, triggerNotification]);

  // Handler to refresh mededelingen
  const refreshMededelingen = async () => {
    try {
      const data = await api.get(`${window.baseDomain}api/mededeling`, { noCache: true });
      if (Array.isArray(data)) {
        setMededelingen(data);
      } else {
        setMededelingen([]);
      }
    } catch (error) {
      console.error('Error fetching mededelingen:', error);
      setMededelingen([]);
      triggerNotification('Fout bij het ophalen van mededelingen.', 'error');
    }
  };

  return (
    <div className="mededeling-component">
      <NotificationComponent />
      <div className="mededeling-component__container">
        <MededelingForm
          api={api}
          triggerNotification={triggerNotification}
          refreshMededelingen={refreshMededelingen}
        />
        <MededelingList
          mededelingen={mededelingen}
          api={api}
          triggerNotification={triggerNotification}
          refreshMededelingen={refreshMededelingen}
        />
      </div>
    </div>
  );
};

export default withHeader(Mededeling);
