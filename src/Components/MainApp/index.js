import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../Structural/TopBar';
import SecondaryTopBar from '../Structural/SecondaryTopBar';
import Sidebar from '../Structural/Sidebar';
import ContentRouting from '../Structural/ContentRouting';
import routesConfig from '../../Config/sidebarConfig';
import NewReservation from '../../Pages/NewReservation';

const MainApp = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [isSidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 900);
  
  const currentRoute = routesConfig.find((route) => route.path === location.pathname);
  const isSidebarHidden = currentRoute && currentRoute.sidebarHidden ? true : false;

  const showSecondaryTopBar = !(location.pathname === '/' && query.has('preview'));

  return (
    <div 
      className={`app-component ${isSidebarHidden ? 'sidebar-hidden' : ''} ${!isSidebarHidden && isSidebarExpanded ? 'sidebar-expanded' : ''}`}
    >
      <NewReservation/>
      <TopBar />
      {showSecondaryTopBar && <SecondaryTopBar />}
      {!isSidebarHidden && (
        <Sidebar onToggleExpand={(expanded) => setSidebarExpanded(expanded)} />
      )}
      <ContentRouting />
    </div>
  );
};

export default MainApp;
