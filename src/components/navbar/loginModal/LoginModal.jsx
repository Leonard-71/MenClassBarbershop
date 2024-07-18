import React, { useState, useEffect, useRef, useCallback } from 'react';
import './LoginModal.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import ResetareParola from '../resetareParola/ResetareParola';

const LoginModal = ({ onClose, onLoginSuccess, onOpenCreareCont }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const modalRef = useRef();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('token', result.token);
                localStorage.setItem('email', email); 
                const tokenPayload = result.token.split('.')[1];
                const payload = JSON.parse(atob(tokenPayload));
                localStorage.setItem('email', payload.sub);

                const userDetailsResponse = await fetch('http://localhost:5050/api/loggeduser/details', {
                    headers: {
                        Authorization: `Bearer ${result.token}`,
                    },
                });
                const userDetails = await userDetailsResponse.json();
 
                if (userDetailsResponse.ok) {
                    localStorage.setItem('role', userDetails.rol);
                    localStorage.setItem('fullName', `${userDetails.nume} ${userDetails.prenume}`);
                    localStorage.setItem('profilePicture', userDetails.poza ? `data:image/jpeg;base64,${userDetails.poza}` : null);
                    onLoginSuccess(userDetails.rol, `${userDetails.nume} ${userDetails.prenume}`, userDetails.poza ? `data:image/jpeg;base64,${userDetails.poza}` : null);
                    onClose();
                } else {
                    setError(userDetails.message || 'Nu s-au putut prelua detaliile utilizatorului');
                }
            } else {
                setError(result.message || 'Email sau parola greșite');
            }
        } catch (error) {
            console.error("Eroare la conectare:", error);
            setError('A apărut o eroare. Vă rugăm să încercați din nou.');
        }
    };

    const handleClickOutside = useCallback((event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    const handleOpenResetModal = () => {
        setIsResetModalOpen(true);
    };

    const handleCloseResetModal = () => {
        setIsResetModalOpen(false);
    };

    return (
        <div className="modal-overlay">
            {!isResetModalOpen ? (
                <div className="modal-logare" ref={modalRef}>
                    <button className="close-modal" onClick={onClose}>Close</button>
                    <div className="background">
                        <div className="rectangle-37"></div>
                        <div className="title">MEN CLASS</div>
                        <div className="sectiunea-conectare">
                            <div className="input-group">
                                <label htmlFor="email">Email</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    placeholder="Introduceți adresa  de email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="password">Parola</label>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    id="password" 
                                    placeholder="Introduceți parola" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                </button>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <div className="sectiunea-creare-cont">
                                {error ? (
                                    <button className="reset-password" onClick={handleOpenResetModal}>Încearcă să îți resetezi parola</button>
                                ) : (
                                    <button className="create-account" onClick={onOpenCreareCont}>Nu ai un cont încă? Creează-ți unul acum</button>
                                )}
                            </div>
                        </div>
                        <div className="buton-conectare">
                            <button className="login-button" onClick={handleLogin}>Conectează-te</button>
                        </div>
                    </div>
                </div>
            ) : (
                <ResetareParola onClose={handleCloseResetModal} />
            )}
        </div>
    );
};

export default LoginModal;
