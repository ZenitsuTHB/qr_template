// topBarConfig.js

import { FaLock, FaPencilAlt, FaUser, FaSignOutAlt, FaCalendar } from 'react-icons/fa';

const topBarConfig = [

  {
    label: 'Uitzonderingen',
    icon: FaLock,
    path: '/exceptions',
    hasDropdown: false,
  },
  {
    label: 'Edit',
    icon: FaPencilAlt,
    path: 'https://preview.reservaties.net/' + "?restaurantId=" + localStorage.getItem('username') + '&admin=true',
    isExternal: true, // Indicates external URL
    hasDropdown: true,
    iconColor: 'black',
    dropdownItems: [
      {
        label: 'Bewerken',
        icon: FaPencilAlt,
        path: 'https://preview.reservaties.net/' + "?restaurantId=" + localStorage.getItem('username') + '&admin=true',
        isExternal: true, // Indicates external URL
      },
    ],
  },
  {
    label: 'Account',
    icon: FaUser,
    path: '/account',
    hasDropdown: true,
    dropdownItems: [
      {
        label: 'Uitloggen',
        icon: FaSignOutAlt,
        action: 'logout',
        isLogout: true,
        iconColor: 'red',
      },
    ],
  },
];

export default topBarConfig;
