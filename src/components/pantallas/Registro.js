import React, { useState, useContext, useEffect } from 'react';
import Input from '../modulos/Input';
import { Contexto as UsuariosContext } from '../contexto/UsuariosContext';
import LoginContainer from '../modulos/LoginContainer';
import { Link } from 'react-router-dom';

const Registro = () => {
  const { state: { userUid, errorGeneral }, registrarNuevoUsuario, confirmarUsuario } = useContext(UsuariosContext);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailValido, setEmailValido] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [signPressed, setSignPressed] = useState(false);

  const [codigo, setCodigo] = useState('');
  const [sign2Pressed, setSign2Pressed] = useState(false);

  useEffect(() => {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailValido(true);
    } else {
      setEmailValido(false);
    }
  }, [email]);

  useEffect(() => {
    if (errorGeneral === 'REGISTRO') {
      setSignPressed(false);
    } else if (errorGeneral === 'CONFIRMACION') {
      setSign2Pressed(false);
    }
  }, [errorGeneral]);

  const signUp = async () => {
    await registrarNuevoUsuario(username, email, password);
    setSignPressed(true);
  };

  const handleConfirmar = async () => {
    setSign2Pressed(true);
    await confirmarUsuario(username, codigo);
  }

  return (
    <LoginContainer titulo='Proyecto take-home' subtitulo='Ingrese credenciales para acceder.'>
      {
        !userUid ?
          <form onSubmit={e => e.preventDefault()} id="formRegistro" className="form-signin needs-validation mb-3">
            <Input autoFocus id="username" placeholder="Nombre de usuario" required
              value={username}
              onChange={setUsername}
            />
            <Input type="email" id="email" placeholder="Correo" required
              value={email}
              onChange={setEmail}
            />
            <Input type="password" id="password" placeholder="Contraseña" required
              value={password}
              onChange={setPassword}
            />
            <small>Tiene que ser de al menos 8 caracteres y contener una mayúsucla, una minúscula y un número.</small>

            <Input type="password" id="passwordConfirm" placeholder="Confirmar contraseña" required
              value={passwordConfirm}
              onChange={setPasswordConfirm}
            />
            <button
              style={{ color: 'white' }} className="btn btn-lg btn-primary btn-block text-uppercase"
              type="submit"
              onClick={signUp}
              disabled={!(username && emailValido && password && passwordConfirm && (password === passwordConfirm)) || signPressed}
            >
              Registrarse
            </button>
          </form>
          :
          <form onSubmit={e => e.preventDefault()} id="formConfirmar" className="form-signin needs-validation mb-3">
            <h4>Se ha enviado a su correo un código de confirmación</h4>
            <p>En cuanto lo reciba, ingréselo en el siguiente campo:</p>
            <Input autoFocus id="codigoConfirm" placeholder="Código de confirmación" required
              value={codigo}
              onChange={setCodigo}
            />
            <button
              style={{ color: 'white' }} className="btn btn-lg btn-primary btn-block text-uppercase"
              type="submit"
              onClick={handleConfirmar}
              disabled={!codigo || sign2Pressed}
            >
              Confirmar usuario
            </button>
          </form>
      }
      <p className="mb-3">
        ¿Ya se registró? Inicie, <Link className="btnTypeAnchor" to={`/`}> sesión</Link>.
      </p>
    </LoginContainer>
  );
};

export default Registro;