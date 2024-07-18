import React, { useState, useRef, useEffect } from "react";
import "./Galerie.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSave,
  faTimes,
  faTrashAlt,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { fetchImagini, addImagine, deleteImagine } from '../../../../Service/galerie';
import ConfirmDialog from '../confirmDialog/ConfirmDialog'; 

const Galerie = ({ token }) => { 
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, index: null }); 
  const sliderRef = useRef(null);

  useEffect(() => {
    const getImagini = async () => {
      try {
        const data = await fetchImagini();
        const imagesData = data.map(img => ({ id: img.pozaId, src: `data:image/jpeg;base64,${img.poza}` }));
        setImages(imagesData);
      } catch (error) {
        console.error('Eroare la preluarea imaginilor:', error);
      }
    };

    getImagini();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview({ file, src: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageToSlider = async () => {
    try {
      const base64Image = preview.src.split(',')[1];  
      const response = await addImagine(base64Image, token); 
      setImages([...images, { id: response.pozaId, src: preview.src }]);
      setPreview(null);
    } catch (error) {
      console.error('Eroare la adăugarea imaginii:', error);
    }
  };

  const cancelImagePreview = () => {
    setPreview(null);
  };

  const handleDeleteImage = (index) => {
    setConfirmDialog({ isOpen: true, index });  
  };

  const confirmDelete = async () => {
    const imageId = images[confirmDialog.index].id;
    try {
      await deleteImagine(imageId, token); 
      setImages(images.filter((_, i) => i !== confirmDialog.index));
      setConfirmDialog({ isOpen: false, index: null });  
    } catch (error) {
      console.error('Eroare la ștergerea imaginii:', error);
    }
  };

  const slideLeft = () => {
    sliderRef.current.scrollBy({
      left: -sliderRef.current.clientWidth / 2,
      behavior: "smooth",
    });
  };

  const slideRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.clientWidth / 2,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleResize = () => {
      sliderRef.current.scrollLeft = 0;
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="gallery-management">
      <div className="container-galerie-admin">
        <button className="nav-button" onClick={slideLeft}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="gallery-wrapper" ref={sliderRef}>
          <div className="gallery">
            {images.map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={image.src} alt={`Uploaded ${index}`} />
                <button
                  className="delete-button"
                  onClick={() => handleDeleteImage(index)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button className="nav-button" onClick={slideRight}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      <div className="upload-preview-section">
        <div className="image-upload">
          <input type="file" onChange={handleImageChange} />
          <div className="upload-icon">
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
        <span className="image-upload-text">Încarcă o imagine</span>
        {preview && (
          <div className="preview-section">
            <img src={preview.src} alt="Preview" />
            <div className="button-container">
              <button className="cancel-button" onClick={cancelImagePreview}>
                <FontAwesomeIcon icon={faTimes} /> Renunță
              </button>
              <button className="add-button" onClick={addImageToSlider}>
                <FontAwesomeIcon icon={faSave} /> Adaugă
              </button>
            </div>
          </div>
        )}
      </div>

      {confirmDialog.isOpen && (
        <ConfirmDialog
          message="Ești sigur că vrei să ștergi această imagine?"
          onConfirm={confirmDelete}
          onCancel={() => setConfirmDialog({ isOpen: false, index: null })}
        />
      )}
    </div>
  );
};

export default Galerie;
