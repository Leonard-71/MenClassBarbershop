import React from 'react'
import './Politica.scss'
import logoPolitici from '../../../assets/politici/politici.png'
import IntroPagini from '../../introPagini/IntroPagini';
const Politica = () => {
  const titluPagina = "POLITICĂ DE CONFIDENȚIALITATE";
  return (
    <div className='pagina-politica-confidentialitate'>
      <IntroPagini logoPagina={logoPolitici} titluPagina={titluPagina} />
      <div className="pagina-politica">
      <h2>Politica de Confidentialitate</h2>
      <p>Bine ati venit la Men Class! Ne luăm angajamentul să protejăm confidentialitatea datelor dumneavoastră. Această politică de confidentialitate explică ce date personale colectăm, modul în care le folosim și drepturile dumneavoastră în legătură cu acestea.</p>
      <h2>Ce date personale colectăm?</h2>
      <p>Colectăm informatii personale pe care ni le furnizati voluntar atunci când utilizati serviciile noastre. Acestea pot include numele, adresa de email, numărul de telefon și alte informatii necesare pentru programări și servicii personalizate.</p>
      <h2>Cum folosim datele personale?</h2>
      <p>Datele personale colectate sunt utilizate în principal pentru a vă oferi serviciile noastre, inclusiv programările, notificările și comunicările legate de serviciile noastre. Acestea pot fi utilizate și în scopuri administrative, de analiză și îmbunătătire a serviciilor noastre.</p>
      <h2>Cu cine partajăm datele personale?</h2>
      <p>Nu partajăm datele personale cu terte părti fără consimtământul dumneavoastră, cu exceptia cazurilor în care acest lucru este necesar pentru a oferi serviciile noastre sau în conformitate cu legile și reglementările aplicabile.</p>
      <h2>Cum vă protejăm datele personale?</h2>
      <p>Ne angajăm să protejăm datele personale prin luarea măsurilor de securitate adecvate pentru a preveni accesul neautorizat, divulgarea sau modificarea acestora.</p>
      <h2>Ce drepturi aveti în legătură cu datele personale?</h2>
      <p>Aveti dreptul de a accesa, rectifica, șterge sau restrictiona prelucrarea datelor personale colectate. De asemenea, aveti dreptul de a vă opune prelucrării acestora și de a solicita portabilitatea datelor.</p>
      <h2>Cum ne contactati?</h2>
      <p>Dacă aveti întrebări sau preocupări referitoare la această politică de confidentialitate sau la modul în care prelucrăm datele dumneavoastră personale, vă rugăm să ne contactati la adresa de email: contact@menclass.ro</p>
    </div>

    </div>
  )
}

export default Politica
