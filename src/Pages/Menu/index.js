// src/Pages/Menu/index.js

import React, { useState, useEffect } from 'react';
import { withHeader } from '../../Components/Structural/Header/index.js';
import './css/menu.css';
import useApi from '../../Hooks/useApi';
import useNotification from '../../Components/Notification';
import MenuForm from './MenuForm';
import MenuList from './MenuList';

const Menu = () => {
  const api = useApi();
  const { triggerNotification, NotificationComponent } = useNotification();

  // State for the list of menus
  const [menus, setMenus] = useState([]);

  // Fetch the menus at component mount
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const data = await api.get(window.baseDomain + 'api/menu', { noCache: true });
        if (Array.isArray(data)) {
          setMenus(data);
        } else {
          setMenus([]);
        }
      } catch (error) {
        console.error('Error fetching menus:', error);
        setMenus([]);
        triggerNotification('Fout bij het ophalen van menu\'s.', 'error');
      }
    };
    fetchMenus();
  }, [api, triggerNotification]);

  // Handler to refresh menus
  const refreshMenus = async () => {
    try {
      const data = await api.get(window.baseDomain + 'api/menu', { noCache: true });
      if (Array.isArray(data)) {
        setMenus(data);
      } else {
        setMenus([]);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      setMenus([]);
      triggerNotification('Fout bij het ophalen van menu\'s.', 'error');
    }
  };

  return (
    <div className="menu-component">
      <NotificationComponent />
      <div className="menu-component__container">
        <MenuForm
          api={api}
          triggerNotification={triggerNotification}
          refreshMenus={refreshMenus}
        />
        <MenuList
          menus={menus}
          api={api}
          triggerNotification={triggerNotification}
          refreshMenus={refreshMenus}
        />
      </div>
    </div>
  );
};

export default withHeader(Menu);
