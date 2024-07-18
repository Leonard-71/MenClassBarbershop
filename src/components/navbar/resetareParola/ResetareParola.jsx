import React, { useState, useRef, useEffect } from 'react';
import './ResetareParola.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const ResetareParola = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const modalRef = useRef(null);

    const handleEmailSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5050/api/forgot_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    email: email
                })
            });

            if (response.ok) {
                setStep(2);
                setMessage('Email-ul a fost trimis cu succes. Verifică căsuța de email pentru cod.');
            } else {
                const result = await response.json();
                setMessage(result.message || 'Nu există niciun cont asociat cu acest email!');
            }
        } catch (error) {
            console.error("Error during email submission:", error);
            setMessage('Nu există niciun cont asociat cu această adresă de email!');
        }
    };

    const handleCodeSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:5050/api/reset-password?token=${code}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                setStep(3);
                setMessage('Codul este valid. Poți acum să îți schimbi parola.');
            } else {
                const result = await response.json();
                setMessage(result.message || 'Codul este invalid. Vă rugăm să încercați din nou.');
            }
        } catch (error) {
            console.error("Error during code verification:", error);
            setMessage('A apărut o eroare. Vă rugăm să încercați din nou.');
        }
    };

    const handlePasswordReset = async () => {
        if (newPassword !== confirmPassword) {
            setMessage('Parolele nu se potrivesc.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5050/api/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    token: code,
                    password: newPassword
                })
            });

            if (response.ok) {
                setMessage('Parola a fost resetată cu succes.');
                setTimeout(onClose, 1000); 
            } else {
                const result = await response.json();
                setMessage(result.message || 'A apărut o eroare. Vă rugăm să încercați din nou.');
            }
        } catch (error) {
            console.error("Error during password reset:", error);
            setMessage('A apărut o eroare. Vă rugăm să încercați din nou.');
        }
    };

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    return (
        <div className="modal-overlay">
            <div className="reset-password-modal" ref={modalRef}>
                <div className="rectangle-37"></div>
                <div className="title">Resetare Parola</div>
                {message && <div className="message">{message}</div>}
                {step === 1 && (
                    <div className="sectiunea-resetare">
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                placeholder="Introduceți adresa de email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="buton-resetare">
                            <button className="reset-button" onClick={handleEmailSubmit}>Trimite Cod</button>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div className="sectiunea-resetare">
                        <div className="input-group">
                            <label htmlFor="code">Cod</label>
                            <input
                                type="text"
                                id="code"
                                placeholder="Introduceți codul"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                        </div>
                        <div className="buton-resetare">
                            <button className="reset-button" onClick={handleCodeSubmit}>Verifică Cod</button>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div className="sectiunea-resetare">
                        <div className="input-group">
                            <label htmlFor="newPassword">Parola Nouă</label>
                            <input
                                type={showNewPassword ? "text" : "password"}
                                id="newPassword"
                                placeholder="Parola Nouă"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button type="button" className="toggle-password" onClick={toggleNewPasswordVisibility}>
                                <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirmă Parola</label>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                placeholder="Confirmă Parola"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button type="button" className="toggle-password" onClick={toggleConfirmPasswordVisibility}>
                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        <div className="buton-resetare">
                            <button className="reset-button" onClick={handlePasswordReset}>Resetează Parola</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResetareParola;
