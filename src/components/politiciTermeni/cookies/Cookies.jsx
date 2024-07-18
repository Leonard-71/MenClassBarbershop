import React from 'react'
import './Cookies.scss'
import IntroPagini from '../../introPagini/IntroPagini';
import logoPolitici from '../../../assets/politici/politici.png'
const Cookies = () => {
  const titluPagina = "POLITICĂ DE COOKIES";
  return (
    <div className='pagina-politica-cookies'>
      <IntroPagini logoPagina={logoPolitici} titluPagina={titluPagina} />

      <div className='politica-cookies'>
      <h2>Politica de Cookies</h2>
      <p>Această politică de cookies explică ce sunt cookie-urile și cum le folosim. Este important să întelegeti ce sunt cookie-urile și de ce le folosim. Este, de asemenea, important să întelegeti tipurile de cookie-uri pe care le folosim și scopul pentru care le folosim.</p>
      <h2>Ce sunt cookie-urile?</h2>
      <p>Cookie-urile sunt fișiere mici de text utilizate pentru a stoca informatii. Acestea sunt stocate pe dispozitivul dvs. atunci când vizitati un site web și sunt utilizate pentru a păstra anumite informatii. Cookie-urile pot fi șterse în orice moment de către utilizator.</p>
      <h2>Cum folosim cookie-urile?</h2>
      <p>Folosim cookie-urile pentru a întelege modul în care utilizati site-ul nostru și pentru a vă îmbunătăti experienta. Acestea pot include, de exemplu, înregistrarea preferintelor dvs. și furnizarea de continut personalizat.</p>
      <h2>Ce tipuri de cookie-uri folosim?</h2>
      <p>Folosim cookie-uri de sesiune și cookie-uri permanente pe site-ul nostru. Cookie-urile de sesiune sunt șterse automat când închideti browserul, în timp ce cookie-urile permanente rămân pe dispozitivul dvs. până când sunt șterse manual sau expiră.</p>
      <h2>Cum puteti controla cookie-urile?</h2>
      <p>Puteti controla și/sau șterge cookie-urile după cum doriti. Puteti șterge toate cookie-urile deja stocate pe computerul dvs. și puteti seta majoritatea browserelor să împiedice stocarea acestora. Cu toate acestea, în acest caz, este posibil să trebuiască să ajustati manual unele preferinte de fiecare dată când vizitati un site, iar anumite servicii și functionalităti pot să nu functioneze.</p>
    </div>
    </div>
  )
}

export default Cookies
