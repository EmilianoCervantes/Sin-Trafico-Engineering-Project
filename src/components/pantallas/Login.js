import React, { useState, useContext, useEffect } from 'react';
import Input from '../modulos/Input';
import { Contexto as UsuariosContext } from '../contexto/UsuariosContext';
import LoginContainer from '../modulos/LoginContainer';
import { Link } from 'react-router-dom';
import { registro } from '../acciones/pantallasNombres';

const Login = () => {
  const { state: { errorGeneral }, loginUsuario } = useContext(UsuariosContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signPressed, setSignPressed] = useState(false);

  useEffect(() => {
    if (errorGeneral === 'LOGIN') {
      setSignPressed(false);
    }
  }, [errorGeneral]);

  const signIn = async () => {
    await loginUsuario(username, password);
    setSignPressed(true);
  };

  return (
    <LoginContainer subtitulo='Ingrese credenciales para acceder.'>
      <form onSubmit={e => e.preventDefault()} id="formLogin" className="form-signin needs-validation mb-3">
        <Input autoFocus id="username" placeholder="Nombre de usuario" required
          value={username}
          onChange={setUsername}
        />
        <Input type="password" id="password" placeholder="Contraseña" required
          value={password}
          onChange={setPassword}
        />
        <button
          style={{ color: 'white' }} className="btn btn-lg btn-primary btn-block text-uppercase"
          type="submit"
          onClick={signIn}
          disabled={!(username && password) || signPressed}
        >
          Entrar
        </button>
      </form>
      <p className="mb-3">
        ¿Todavía no tiene una cuenta? ¡Adelante, <Link className="btnTypeAnchor" to={`/${registro}`}> regístrese</Link>!
      </p>
    </LoginContainer>
  );
};

export default Login;