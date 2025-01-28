// src/components/DragAndDropEditor/defaultElements.js

import React from 'react';
import {
  FaFont,
  FaEnvelope,
  FaPhone,
  FaList,
  FaHeading,
  FaKeyboard,
  FaParagraph,
} from 'react-icons/fa';

export const initialBlocks = [
  { id: '1', type: 'title', label: 'Titel', icon: <FaHeading /> },
  { id: '2', type: 'paragraph', label: 'Paragraaf', icon: <FaParagraph /> },
  { id: '3', type: 'input', label: 'Invoerveld', icon: <FaKeyboard /> },
  { id: '4', type: 'select', label: 'Selectievak', icon: <FaList /> },
  { id: '5', type: 'phone', label: 'Telefoon', icon: <FaPhone /> },
  { id: '6', type: 'email', label: 'Email', icon: <FaEnvelope /> },
  { id: '7', type: 'textarea', label: 'Tekstveld', icon: <FaFont /> },
  
];

// Predefined Default Canvas Items: Voornaam, Achternaam, Telefoon, Extra Info / Allergenen
export const defaultCanvasItems = [
  {
    id: 'default-voornaam',
    type: 'input',
    label: 'Voornaam',
    placeholder: 'Uw Voornaam',
    required: true,
  },
  {
    id: 'default-achternaam',
    type: 'input',
    label: 'Achternaam',
    placeholder: 'Uw Achternaam',
    required: true,
  },
  {
    id: 'default-email',
    type: 'input',
    label: 'Email',
    placeholder: 'Uw Eemail',
    required: true,
  },
  {
    id: 'default-telefoon',
    type: 'phone',
    label: 'Telefoon',
    placeholder: 'Uw Telefoonnummer',
    required: true,
  },
  {
    id: 'default-extra-info',
    type: 'textarea',
    label: 'Extra Info / Allergenen',
    placeholder: 'Eventuele extra informatie of allergenen',
    required: false,
  },
];
