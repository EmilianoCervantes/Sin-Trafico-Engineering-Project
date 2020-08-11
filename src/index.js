import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';
import { Proveedor as UsuariosProveedor } from './components/contexto/UsuariosContext';

ReactDOM.render(
  <UsuariosProveedor>
    <App />
  </UsuariosProveedor>
  , document.getElementById("root"));