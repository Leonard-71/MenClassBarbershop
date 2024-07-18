import React, { useEffect, useState } from 'react';
import './GalerieImagini.scss';
import { fetchImagini } from '../../../Service/galerie';
import FsLightbox from 'fslightbox-react';

const GalerieImagini = () => {
    const [imagini, setImagini] = useState([]);
    const [toggler, setToggler] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);

    useEffect(() => {
        const getImagini = async () => {
            try {
                const data = await fetchImagini();
                const imageBase64 = data.map(img => `data:image/jpeg;base64,${img.poza}`);
                setImagini(imageBase64);
            } catch (error) {
                console.error('Eroare la preluarea imaginilor:', error);
            }
        };

        getImagini();
    }, []);

   
    const handleOpenLightbox = (index) => {
        setPhotoIndex(index);
        setToggler(!toggler);
    };

    return (
        <div className="container-galerie">
            <div className="row-galerie">
                {imagini.map((image, index) => (
                    <div key={index} className="col-galerie">
                        <div 
                            className={`card-galerie ${index % 2 === 0 ? 'card-white' : 'card-brown'}`}
                            onClick={() => handleOpenLightbox(index)}
                        >
                            <img className="card-img" src={image} alt={`Imagine ${index}`} />
                        </div>
                    </div>
                ))}
            </div>

            <FsLightbox
                toggler={toggler}
                sources={imagini}
                slide={photoIndex+1}
            />
        </div>
    );
};

export default GalerieImagini;
