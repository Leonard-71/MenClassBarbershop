import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";
import "./App.scss";
import Navbar from "./components/navbar/Navbar";
import Despre from "./components/despre/Despre";
import Galerie from "./components/galerie/Galerie";
import Servicii from "./components/servicii/Servicii";
import Echipa from "./components/echipa/Echipa";
import Contact from "./components/contact/Contact";
import Footer from "./components/footer/Footer";
import Termeni from "./components/politiciTermeni/termeni/Termeni";
import Politica from "./components/politiciTermeni/politica/Politica";
import Cookies from "./components/politiciTermeni/cookies/Cookies";
import AdminPanel from "./components/admin/panel/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginModal from "./components/navbar/loginModal/LoginModal";
import CreareContModal from "./components/navbar/creareCont/CreareContModal";
import ProgramariClienti from "./components/programari/programariClienti/ProgramariClienti";
import ProgramariAngajati from "./components/programari/programariAngajati/ProgramariAngajati";
import ConcediuAngajat from "./components/concediiAngajat/ConcediuAngajat";
import SolicitareConcediu from "./components/concediiAngajat/solicitareConcediu/SolicitareConcediu";

const AppContent = ({ onOpenLoginModal, onOpenCreareContModal }) => {
  const location = useLocation();
  const shouldShowFooter = !location.pathname.startsWith("/admin");

  return (
    <>
      <div className="pages">
        <Navbar
          onOpenLoginModal={onOpenLoginModal}
          onOpenCreareContModal={onOpenCreareContModal}
        />
        <Routes>
          <Route path="/" element={<Navigate to="/despre" />} />
          <Route path="/despre" element={<Despre />} />
          <Route path="/galerie" element={<Galerie />} />
          <Route path="/servicii" element={<Servicii />} />
          <Route path="/echipa" element={<Echipa />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/termeni" element={<Termeni />} />
          <Route path="/politica" element={<Politica />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/ProgramariClienti" element={<ProgramariClienti />} />
          <Route path="/ProgramariAngajati" element={<ProgramariAngajati />} />
          <Route path="/SolicitareConcediu" element={<SolicitareConcediu />} />
          <Route path="/concediuAngajat" element={<ConcediuAngajat />} />


          <Route path="/admin" element={<AdminPanel />} />
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            
          </Route>
        </Routes>
        {shouldShowFooter && <Footer />}
      </div>
    </>
  );
};

const App = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCreareContModalOpen, setIsCreareContModalOpen] = useState(false);

  const handleOpenLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsCreareContModalOpen(false);
  };

  const handleOpenCreareContModal = () => {
    setIsLoginModalOpen(false);
    setIsCreareContModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsLoginModalOpen(false);
    setIsCreareContModalOpen(false);
  };

  const handleLoginSuccess = (isAdmin) => {
    localStorage.setItem("isAdmin", isAdmin);
  };

  return (
    <Router>
      <AppContent
        onOpenLoginModal={handleOpenLoginModal}
        onOpenCreareContModal={handleOpenCreareContModal}
      />
      {isLoginModalOpen && (
        <LoginModal
          onClose={handleCloseModals}
          onLoginSuccess={handleLoginSuccess}
          onOpenCreareCont={handleOpenCreareContModal}
        />
      )}
      {isCreareContModalOpen && <CreareContModal onClose={handleCloseModals} />}
    </Router>
  );
};

export default App;
