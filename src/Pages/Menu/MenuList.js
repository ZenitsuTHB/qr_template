// src/Pages/Menu/MenuList.js

import React from 'react';
import './css/menu.css';
import MenuItem from './MenuItem';

const MenuList = ({ menus, api, triggerNotification, refreshMenus }) => {
  return (
    <div className="menu-component__list">
      <h3>Menu's</h3>
      {menus.length > 0 ? (
        <div className="menu-component__menu-list">
          {menus.map((menu) => (
            <MenuItem
              key={menu._id}
              menu={menu}
              api={api}
              triggerNotification={triggerNotification}
              refreshMenus={refreshMenus}
            />
          ))}
        </div>
      ) : (
        <p>Geen menu's gevonden.</p>
      )}
    </div>
  );
};

export default MenuList;
