import React from 'react';
import { Routes, Route } from 'react-router-dom';
import routesConfig from '../../../Config/sidebarConfig.js';

const ContentRouting = () => {
  return (
    <div className="content-routing">
      <Routes>
        {routesConfig.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </div>
  );
};

export default ContentRouting;
