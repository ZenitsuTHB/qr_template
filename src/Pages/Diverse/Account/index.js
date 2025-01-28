// src/components/AccountManagement.jsx

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import WelcomeAnimation from './WelcomeAnimation';
import LanguageSelection from './LanguageSelection';
import AvatarSelection from './AvatarSelection';
import useNotification from '../../Components/Notification/index';
import './css/animations.css';
import './css/mobile.css';

const AccountManagement = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { triggerNotification, NotificationComponent } = useNotification();
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const { t } = useTranslation('accountOnboarding');

  const handleAnimationComplete = () => {
    setCurrentStep(2);
  };

  const handleLanguageSelect = (languageCode) => {
    console.log(`Selected Language Code: ${languageCode}`);
    setSelectedLanguage(languageCode);
    setCurrentStep(3);
    triggerNotification(t('languageSelected', { language: languageCode }));
  };

  const handleAvatarSelect = (avatarIndex) => {
    console.log(`Selected Avatar Index: ${avatarIndex}`);
    setSelectedAvatar(avatarIndex);
    triggerNotification(t('avatarSelected'));
  };

  return (
    <div>
      <NotificationComponent />
      {currentStep === 1 && (
        <WelcomeAnimation onComplete={handleAnimationComplete} />
      )}
      {currentStep === 2 && (
        <LanguageSelection onSelectLanguage={handleLanguageSelect} />
      )}
      {currentStep === 3 && (
        <AvatarSelection onSelectAvatar={handleAvatarSelect} />
      )}
    </div>
  );
};

export default AccountManagement;
