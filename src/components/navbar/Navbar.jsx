import React, { useState, useEffect } from "react";
import "./Navbar.scss";
import Logo from '../../assets/logo1.png';
import UserIcon from '../../assets/navbar/profile.png';
import LoginModal from '../navbar/loginModal/LoginModal';
import CreareContModal from '../navbar/creareCont/CreareContModal';
import EditProfileModal from '../navbar/editProfileModal/EditProfileModal';
import ClientMenu from '../navbar/clientMenu/ClientMenu';

const Navbar = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isCreareContModalOpen, setCreareContModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isClientMenuOpen, setClientMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [fullName, setFullName] = useState('');
  const [profilePicture, setProfilePicture] = useState(UserIcon);
  const [profileUpdated, setProfileUpdated] = useState(false);

  const fetchUserData = async () => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);

    const role = localStorage.getItem('role');
    setUserRole(role);

    const storedFullName = localStorage.getItem('fullName');
    setFullName(storedFullName);

    const storedProfilePicture = localStorage.getItem('profilePicture');
    if (storedProfilePicture) {
      setProfilePicture(storedProfilePicture);
    } else {
      setProfilePicture(UserIcon);
    }

    if (loggedIn) {
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');
      if (email && token) {
        try {
          const response = await fetch(`http://localhost:5050/admin/users/${email}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const userData = await response.json();

          if (userData.poza) {
            const profileImage = `data:image/jpeg;base64,${userData.poza}`;
            setProfilePicture(profileImage);
            localStorage.setItem('profilePicture', profileImage);
          } else {
            setProfilePicture(UserIcon);
            localStorage.setItem('profilePicture', UserIcon);
          }
        } catch (error) {
          console.error('Eroare la preluarea datelor utilizatorului:', error);
          setProfilePicture(UserIcon);
        }
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [profileUpdated]);

  const navLinks = [
    { title: "Despre", href: "/despre" },
    { title: "Galerie", href: "/galerie" },
    { title: "Echipa", href: "/echipa" },
    { title: "Servicii", href: "/servicii" },
    { title: "Contact", href: "/contact" },
  ];

  const infoNavbar = {
    title: "MEN CLASS",
    btnConecteaza: isLoggedIn ? fullName : "Conectează-te"
  };

  const handleLoginSuccess = (role, fullName, profilePicture) => {
    setIsLoggedIn(true);
    setLoginModalOpen(false);
    setUserRole(role);
    setFullName(fullName);
    setProfilePicture(profilePicture ? profilePicture : UserIcon);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('role', role);
    localStorage.setItem('fullName', fullName);
    localStorage.setItem('profilePicture', profilePicture ? profilePicture : UserIcon);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setClientMenuOpen(false);
    setUserRole('');
    setFullName('');
    setProfilePicture(UserIcon);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('fullName');
    localStorage.removeItem('profilePicture');
    localStorage.removeItem('token'); 
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      setClientMenuOpen(!isClientMenuOpen);
    } else {
      setLoginModalOpen(true);
    }
  };

  const handleOpenCreareContModal = () => {
    setLoginModalOpen(false);
    setCreareContModalOpen(true);
  };

  const handleOpenEditProfileModal = () => {
    setClientMenuOpen(false);
    setEditProfileModalOpen(true);
  };

  const handleProfileUpdated = () => {
    setProfileUpdated(!profileUpdated);
  };

  return (
    <div className="navbar-menclass">
      <div className="info-menclass">
        <span>{infoNavbar.title}</span>
        <img src={Logo} alt="Logo" />
      </div>
      <ul className="nav-links-menclass">
        {navLinks.map((link, index) => (
          <li key={index}>
            <a href={link.href}>{link.title}</a>
          </li>
        ))}
      </ul>
      <div className="user-profile-menclass" onClick={handleProfileClick}>
        <span>{infoNavbar.btnConecteaza}</span>
        <img src={profilePicture} alt="Profile" className="rounded-profile-menclass" />
      </div>

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => setLoginModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          onOpenCreareCont={handleOpenCreareContModal}
        />
      )}
      {isCreareContModalOpen && <CreareContModal onClose={() => setCreareContModalOpen(false)} />}
      {isClientMenuOpen && (
        <ClientMenu
          onClose={() => setClientMenuOpen(false)}
          onLogout={handleLogout}
          userRole={userRole}
          onEditProfile={handleOpenEditProfileModal}
        />
      )}
      {isEditProfileModalOpen && <EditProfileModal onClose={() => setEditProfileModalOpen(false)} onProfileUpdated={handleProfileUpdated} />}
    </div>
  );
};

export default Navbar;
