import React, { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

const LightboxComponent = ({ images }) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  const openLightbox = (index) => {
    setPhotoIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const renderImages = () => {
    const imageCount = images?.length;

    if (imageCount === 1) {
      return (
        <img
          key={0}
          src={images[0]?.src}
          alt={images[0]?.alt}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            margin: "auto",
            borderRadius: "15px",
          }}
          onClick={() => openLightbox(0)}
        />
      );
    } else if (imageCount === 2) {
      return (
        <div
          style={{
            display: "flex",
            height: "30vh",
            justifyContent: "space-between",
          }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              style={{
                width: "48%",
                height: "auto",
                borderRadius: "15px",
              }}
              onClick={() => openLightbox(index)}
            />
          ))}
        </div>
      );
    }
    else if (imageCount === 3) {
      const firstRowImages = images.slice(0, 1);
      const secondRowImages = images.slice(1);
      return (
        <div style={{ width:"100%"}}>
          <div
            style={{
              display: "flex",
              height: "30vh",
              justifyContent: "space-between",
              marginBottom: "10px",
             
            }}
          >
            {firstRowImages.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "15px",
                }}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              height: "20vh",
              justifyContent: "space-between",
            }}
          >
            {secondRowImages.map((image, index) => (
              <img
                key={index + 2}
                src={image.src}
                alt={image.alt}
                style={{
                  width: "49%",
                  height: "auto",
                  borderRadius: "15px",
                }}
                onClick={() => openLightbox(index + 2)}
              />
            ))}
          </div>
        </div>
      );
    } 
    else if (imageCount === 4) {
      const firstRowImages = images.slice(0, 1);
      const secondRowImages = images.slice(1);
      return (
        <div>
          <div
            style={{
              display: "flex",
              height: "30vh",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            {firstRowImages.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: "15px",
                }}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              height: "20vh",
              justifyContent: "space-between",
            }}
          >
            {secondRowImages.map((image, index) => (
              <img
                key={index + 2}
                src={image.src}
                alt={image.alt}
                style={{
                  width: "31.33%",
                  height: "auto",
                  borderRadius: "15px",
                }}
                onClick={() => openLightbox(index + 2)}
              />
            ))}
          </div>
        </div>
      );
    } 
    else if (imageCount <= 5) {
      const firstRowImages = images.slice(0, 2);
      const secondRowImages = images.slice(2);

      return (
        <div>
          <div
            style={{
              display: "flex",
              height: "30vh",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            {firstRowImages.map((image, index) => (
              <img
                key={index}
                src={image.src}
                alt={image.alt}
                style={{
                  width: "49%",
                  height: "auto",
                  borderRadius: "15px",
                }}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              height: "20vh",
              justifyContent: "space-between",
            }}
          >
            {secondRowImages.map((image, index) => (
              <img
                key={index + 2}
                src={image.src}
                alt={image.alt}
                style={{
                  width: "32%",
                  height: "auto",
                  borderRadius: "15px",
                }}
                onClick={() => openLightbox(index + 2)}
              />
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      {renderImages()}
      {lightboxOpen && (
        <Lightbox
          mainSrc={images[photoIndex].src}
          nextSrc={images[(photoIndex + 1) % images.length].src}
          prevSrc={images[(photoIndex + images.length - 1) % images.length].src}
          onCloseRequest={closeLightbox}
          onMovePrevRequest={() =>
            setPhotoIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % images.length)
          }
        />
      )}
    </div>
  );
};

export default LightboxComponent;
