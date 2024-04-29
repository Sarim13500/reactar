import React from 'react';
import logoImage from '../assets/triona.png'
import './TrionaLogo.scss'; // Add this line to import your CSS

function TrionaLogo() {
    return (
        <img src={logoImage} alt="Logo" className="triona-logo"/>
    );
}

export default TrionaLogo;
