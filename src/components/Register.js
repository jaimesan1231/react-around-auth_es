import React from "react";

const Register = () => {
  return (
    <div className="register">
      <form action="" className="form">
        <h2 className="form__title form__title_theme_dark form__title_form-type_large">
          Regístrate
        </h2>
        <label className="form__label">
          <input
            type="email"
            className="form__input form__input_theme_dark"
            id="link"
            placeholder="Correo electrónico"
            required
          />
        </label>
        <label className="form__label">
          <input
            type="password"
            className="form__input form__input_theme_dark"
            id="password"
            placeholder="Contraseña"
            required
          />
        </label>
        <button className="form__button form__button_theme_dark form__button_form-type_large">
          Regístrate
        </button>
        <a href="/" className="form__link">
          ¿Ya eres miembro? Inicia sesión aquí
        </a>
      </form>
    </div>
  );
};

export default Register;
