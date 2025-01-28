// Profile.jsx

import React, { useState, useEffect } from 'react';
import ProfileImage from './ProfileImage';
import ProfileBio from './ProfileBio';
import AccountManage from './AccountManage';
import useApi from '../../Hooks/useApi';
import { avatarMapping, defaultAvatar } from './Hooks/avatarMapping';
import './css/style.css';

const Profile = ({ triggerNotification }) => {
  const api = useApi();
  
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        console.log("Account Settings GET");
        const data = await api.get(`${window.baseDomain}api/account`, { noCache: true });
        setAccountData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        triggerNotification('Fout bij het ophalen van accountgegevens', 'error');
      }
    };

    fetchAccountData();
  }, [api, triggerNotification]);

  const updateAccountData = (updatedData) => {
    setAccountData(updatedData);
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-page__container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!accountData) {
    return (
      <div className="profile-page">
        <div className="profile-page__container">
          <p>Geen accountgegevens beschikbaar.</p>
        </div>
      </div>
    );
  }

  // Derive full name
  const fullName = `${accountData.first_name} ${accountData.last_name}`.trim();

  return (
    <div className="profile-page">
      <div className="profile-page__container">
        {/* Pass triggerNotification down to AccountManage */}
        <AccountManage
          accountData={accountData}
          setAccountData={setAccountData}
          api={api}
          triggerNotification={triggerNotification}
        />
      </div>
    </div>
  );
};

export default Profile;
