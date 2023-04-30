import React from "react";
import addIcon from "../images/add.svg";
import accepted from "../images/accepted.jpg";

const InfoTooltip = () => {
  return (
    <div className="popup popup_opened">
      <div className="popup__container infoTooltip">
        <img
          src={addIcon}
          alt="Icono de cerrar"
          className="popup__close-icon popup__close-icon_place_center "
          // onClick={onClose}
        />
        <img src={accepted} alt="" className="popup__image" />
        <h2 className="popup__title">¡Correcto! Ya estás registrado</h2>
      </div>
    </div>
  );
};

export default InfoTooltip;
