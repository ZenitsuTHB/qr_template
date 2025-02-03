// src/config/secondaryTopBars.js

/*const isMobile = window.innerWidth <= 768;

export const sections = [

	{ id: 'Overview', title: 'Overview', label: isMobile ? 'O' : 'Overview' },
	{ id: 'Generate', title: 'Generate QR', label: isMobile ? 'G' : 'Generate' },
	{ id: 'Scan', title: 'Scan QR', label: isMobile ? 'S' : 'Scan' },
	{ id: 'History', title: 'History', label: isMobile ? 'H' : 'History' },
];*/

  
export const qrManagerSecondaryTopBar = [
	{
	  label: 'Overview',
	  path: '',
	},
	{
	  label: 'Generator',
	  path: 'generate',
	},
	{
	  label: 'Generated',
	  path: 'generated',
	},
	{
	  label: 'History',
	  path: 'history',
	},
  ];


export const overviewSecondaryTopBar = [
	{
	  label: 'Maandoverzicht',
	  path: '/',
	},
	{
	  label: 'Dagoverzicht',
	  path: '/day',
	}
  ];

  export const tableSecondaryTopBar = [
	{
	  label: 'Bekijken',
	  path: '/table',
	},
	{
	  label: 'Bewerken',
	  path: '/table/table-editor',
	},
	{
		label: 'Lijst',
		path: 'table/table-list'
	}
  ];

  export const settingsSecondaryTopBar = [
	{
	  label: 'Reservaties',
	  path: '/settings',
	},
	{
	  label: 'Email',
	  path: '/settings/email',
	},
	{
		label: 'Pdf Menu',
		path: '/settings/pdf-menu',
	}
  ];
  
  
  export const calendarSecondaryTopBar = [
	{
	  label: 'Openingsuren',
	  path: '/scheme',
	},
	{
	  label: 'Kalender',
	  path: '/scheme/calendar',
	},
  ];

  export const openinghoursSecondaryTopBar = [
	{
	  label: 'Ontbijt',
	  path: '/openinghours',
	},
	{
	  label: 'Lunch',
	  path: '/openinghours/lunch',
	},
	{
		label: 'Diner',
		path: '/openinghours/dinner',
	},
  ];
  
  export const designSecondaryTopBar = [
	{
	  label: 'Beheer',
	  path: '/settings',
	},
	{
	  label: 'Ontwerp',
	  path: '/settings/design',
	},
	{
	  label: 'Bekijken',
	  path: 'settings/launch',
	},
  ];

  export const accountSecondaryTopBar = [
	{
	  label: 'Account',
	  path: '/account/',
	},
	{
	  label: 'Personeel',
	  path: '/account/team',
	},
  ];
  
  
  export const giftCardSecondaryTopBar = [
	{
	  label: 'Overzicht',
	  path: '/giftcard/',
	},
	{
	  label: 'Ontwerpen',
	  path: '/giftcardEditor',
	},
	{
	  label: 'Instellingen',
	  path: '/giftcardSettings',
	},
  ];