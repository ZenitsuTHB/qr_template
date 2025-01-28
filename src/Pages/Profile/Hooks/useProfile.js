// src/components/Profile/useProfile.js
import { useState, useEffect } from 'react';
import { avatarMapping, defaultAvatar } from './avatarMapping';

const useProfile = () => {
  const [profileImage, setProfileImage] = useState(defaultAvatar);
  const [bio, setBio] = useState('We zijn heel trots op ons restaurant!');
  const [name, setName] = useState('John Doe');
  const [interests, setInterests] = useState(['Admin Account', '3 Maanden Actief']);

  useEffect(() => {
    const selectedAvatar = localStorage.getItem('selectedAvatar');
    if (selectedAvatar && avatarMapping[selectedAvatar]) {
      setProfileImage(avatarMapping[selectedAvatar]);
    }

    const storedBio = localStorage.getItem('profileBio');
    if (storedBio) setBio(storedBio);

    const storedName = localStorage.getItem('profileName');
    if (storedName) setName(storedName);

    const storedInterests = localStorage.getItem('profileInterests');
    if (storedInterests) {
      setInterests(JSON.parse(storedInterests));
    }
  }, []);

  const handleAvatarSelect = (avatarKey) => {
    setProfileImage(avatarMapping[avatarKey]);
    localStorage.setItem('selectedAvatar', avatarKey);
  };

  return { profileImage, bio, name, interests, handleAvatarSelect };
};

export default useProfile;
