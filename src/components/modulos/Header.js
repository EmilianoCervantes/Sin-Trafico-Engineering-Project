import React, { useContext } from 'react';
import { Contexto as UsuariosContext } from '../contexto/UsuariosContext';

const Header = () => {
  const { state: { userUid }, logoutUsuario } = useContext(UsuariosContext);

  const signOut = () => {
    logoutUsuario();
  };

  return (
    <header className="row">
      <div id="navegacion" className="col-sm-12 bg-nav">
        <nav className="navbar navbar-dark">
          <h1 className="d-none d-md-block">Bienvenid@ <span className="d-none d-lg-inline">{`${userUid}`}</span></h1>
          <div className="navbar-expand-lg" id="navbarSupportedContent">
            <button className="btn btn-danger mr-1 botonMenu" onClick={signOut} tabIndex="-1" aria-disabled="true">
              <i className="fas fa-sign-out-alt">Salir</i>
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;