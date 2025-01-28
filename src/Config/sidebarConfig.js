// src/routesConfig.js

import {
  FaPlus,
  FaStar,
  FaCalendarAlt,
  FaCog,
  FaFlag,
  FaShieldAlt,
  FaUser,
  FaTable,
  FaMailBulk,
  FaGift,
  FaPencilAlt,
  FaChair,
  FaFileDownload,
  FaUtensilSpoon,
  FaPeopleCarry,
  FaUserFriends,
  FaBell,
  FaLock,
  FaFilePdf,
  FaSafari,
} from 'react-icons/fa';

import Profile from '../Pages/Profile/index.js';
import DayList from '../Pages/Dashboard/DayList/index.js';
import GiftCard from '../Pages/Giftcard/GiftCard'
import GiftcardEditor from '../Pages/Giftcard/GiftcardEditor'
import TablePlan from '../Pages/Tables/TablePlan/index.js'
import SettingsTabsWithHeader from '../Pages/FormEditor/index.js'
import SchedulePage from '../Pages/Openingsuren/index.js'; 


import {
  overviewSecondaryTopBar,
  calendarSecondaryTopBar,
  accountSecondaryTopBar,
  settingsSecondaryTopBar,
  openinghoursSecondaryTopBar,
  giftCardSecondaryTopBar,
  tableSecondaryTopBar
} from './secondaryTabConfig.js';
import Language from '../Pages/Profile/Language/index.js';
import NewReservationAdmin from '../Pages/NewReservation/index.js';
import RootComponent from './RootComponent.js';
import Settings from '../Pages/Settings/GeneralSettings/index.js';
import EmailSettings from '../Pages/Settings/EmailSettings/index.js';
import TableEditor from '../Pages/Tables/TableEditor/index.js';
import TableList from '../Pages/Tables/TableList/index.js';
import Menu from '../Pages/Menu/index.js';
import Personeel from '../Pages/Personeel/index.js';
import Mededeling from '../Pages/Mededeling/index.js';
import Openingsuren from '../Pages/Openingsuren/index.js';
import Uitzonderingen from '../Pages/Uitzonderingen/index.js';
import UploadPdf from '../Pages/UploadPdf/index.js';


const routesConfig = [
  {
    path: '/',
    element: <RootComponent />, // Use RootComponent here
    label: 'Dashboard',
    icon: FaStar,
    isMenu: true,
    isMobile: true,
    isTab: true,
    secondaryTopBar: overviewSecondaryTopBar,
  },
  {
    path: '/menu',
    element: <Menu title="Menu"/>, // Use RootComponent here
    label: 'Menu',
    icon: FaUtensilSpoon,
    isMenu: true,
    isMobile: true,
    isTab: false,
  },
  {
    path: '/notification',
    element: <Mededeling title="Mededeling" />,
    label: 'Mededeling',
    icon: FaBell,
    isMenu: true,
    isMobile: false,
    isTab: false,
  },
  {
    path: '/day',
    element: <DayList title="Dagoverzicht" />,
    label: 'Dagoverzicht',
    icon: FaStar,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: overviewSecondaryTopBar,
  },
  {
    path: '/exceptions',
    element: <Uitzonderingen title="Uitzonderingen"/>, // Use RootComponent here
    label: 'Uitzonderingen',
    icon: FaLock,
    isMenu: true,
    isMobile: true,
    isTab: false,
  },
  {
    path: '/openinghours',
    element: <Openingsuren title="Openingsuren" mealType="breakfast"/>, // Use RootComponent here
    label: 'Openingsuren',
    icon: FaCalendarAlt,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: openinghoursSecondaryTopBar,
  },
  {
    path: '/openinghours/lunch',
    element: <Openingsuren title="Openingsuren" mealType="lunch"/>, // Use RootComponent here
    label: 'Openingsuren',
    icon: FaCalendarAlt,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: openinghoursSecondaryTopBar,
  },
  {
    path: '/openinghours/dinner',
    element: <Openingsuren title="Openingsuren" mealType="dinner"/>, // Use RootComponent here
    label: 'Openingsuren',
    icon: FaCalendarAlt,
    isMenu: true,
    isMobile: false,
    isTab: false,
    secondaryTopBar: openinghoursSecondaryTopBar,
  },
  {
    path: '/settings/email',
    element: <EmailSettings title="Administratie" />,
    label: 'Email Notificaties',
    icon: FaMailBulk,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: settingsSecondaryTopBar,
  },
  {
    path: '/account',
    element: <Profile title="Account" />,
    label: 'Account',
    icon: FaUser,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: accountSecondaryTopBar,
  },
  {
    path: '/account/team',
    element: <Personeel title="Personeel" />,
    label: 'Personeel',
    icon: FaUserFriends,
    isMenu: true,
    isMobile: true,
    isTab: true,
  },
  {
    path: '/account/language',
    element: <Language title="Taal" />,
    label: 'Taal',
    icon: FaFlag,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: accountSecondaryTopBar,
  },
  {
    path: '/account/security',
    element: <Profile title="Beveiliging" />,
    label: 'Beveiliging',
    icon: FaShieldAlt,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: accountSecondaryTopBar,
  },
  {
    path: '/settings/pdf-menu',
    element: <UploadPdf title="Pdf Menu" />,
    label: 'Pdf Menu',
    icon: FaFilePdf,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: settingsSecondaryTopBar,
  },
  {
    path: '/settings',
    element: <Settings title="Administratie" />,
    label: 'Administratie',
    icon: FaCog,
    isMenu: false,
    isMobile: false,
    isTab: false,
    secondaryTopBar: settingsSecondaryTopBar,
  },

];


/*

{
  path: '/giftcard',
  element: <GiftCard title="Cadeaubonnen" />,
  label: 'Cadeaubonnen',
  icon: FaGift,
  isMenu: true,
  isMobile: true,
  isTab: true,
  secondaryTopBar: giftCardSecondaryTopBar,
},
{
  path: '/giftcard/editor',
  element: <GiftcardEditor title="Cadeaubonnen Ontwerpen" />,
  label: 'Cadeaubonnen Ontwerpen',
  icon: FaPencilAlt,
  isMenu: false,
  isMobile: false,
  isTab: false,
  secondaryTopBar: giftCardSecondaryTopBar,
},

{
  path: '/table',
  element: <TablePlan title="Tafelplan" />,
  label: 'Tafelplan',
  icon: FaChair,
  isMenu: true,
  isMobile: true,
  isTab: true,
  secondaryTopBar: tableSecondaryTopBar,
},
{
  path: 'table/table-editor',
  element: <TableEditor title="Tafels Bewerken" />,
  label: 'Tafels Bewerken',
  icon: FaTable,
  isMenu: false,
  isMobile: false,
  isTab: false,
  secondaryTopBar: tableSecondaryTopBar,
},
{
  path: 'table/table-list',
  element: <TableList title="Tafel Lijst" />,
  label: 'Tafel Lijst',
  icon: FaTable,
  isMenu: false,
  isMobile: false,
  isTab: false,
  secondaryTopBar: tableSecondaryTopBar,
},
*/



export default routesConfig;


