import { CognitoUserPool, CognitoUserAttribute, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';
import axios from '../axios/axios';

import crearContextoDatos from './crearContextoDatos';
import {
  USER_SIGNIN, USER_SIGNOUT, USER_REGISTER, USER_CONFIRM,
  UPDATE_VEHI, USER_ERROR, USER_VERIFY
} from '../acciones/accionesNombres';

import history from '../navegacion';
import { home } from '../acciones/pantallasNombres';

const poolData = {
  UserPoolId: 'us-east-1_jVsiWwlHG', // Poner el user pool id
  ClientId: '113i7gofjf3dssacpkjlng8cd6', // Poner el client id
};
const userPool = new CognitoUserPool(poolData);

const reducerSignIn = (state = null, action) => {
  switch (action.type) {
    case USER_REGISTER:
      return { ...state, userUid: action.payload, errorGeneral: null };
    case USER_CONFIRM:
      return { ...state, login: true, errorGeneral: null };
    case USER_SIGNIN:
      return { ...state, userUid: action.payload, login: true, errorGeneral: null };
    case USER_VERIFY:
      return { ...state, sessionToken: action.payload.sessionToken, accessToken: action.payload.accessToken };
    case USER_SIGNOUT:
      return { userUid: null, login: null, errorGeneral: null, sessionToken: null, accessToken: null };
    case USER_ERROR:
      return { ...state, errorGeneral: action.payload };
    case UPDATE_VEHI:
      return { ...state, idVehiculo: action.payload.id, placasVehiculo: action.payload.placas, latVevhiculo: action.payload.lat, longVehiculo: action.payload.long }
    default:
      return state;
  }
};

/**
 * Una nueva persona está intentando registrarse
 * @param {string} usuario 
 * @param {string} email 
 * @param {string} contrasenia 
 */
const registrarNuevoUsuario = dispatch => {
  return async (usuario, email, contrasenia) => {
    var error = false;

    const attributeList = [];
    const dataEmail = {
      Name: 'email',
      Value: email,
    };
    attributeList.push(new CognitoUserAttribute(dataEmail));

    await userPool.signUp(usuario, contrasenia, attributeList, null, (err, result) => {
      if (err) {
        window.Swal.fire({
          title: '¡Revise sus campos!',
          text: 'Puede que las contraseñas no coincidan o que no contenga los elementos necesarios.',
          icon: 'warning',
          confirmButtonText: 'OK!'
        });

        dispatch({ type: USER_ERROR, payload: 'REGISTRO' });
      } else {
        const cognitoUser = result.user;
        dispatch({ type: USER_REGISTER, payload: cognitoUser.getUsername() });
        error = false;
      }
    });

    return error;
  };
};

/**
 * Ingresar el código recibido en correo e interpretarlo para confirmar al usuario
 * @param {string} usuario - username registrado por el usuario en el form de registro
 * @param {string} codigoConfirm - código que llegó por correo
 */
const confirmarUsuario = dispatch => {
  return async (usuario, codigoConfirm) => {
    const userData = {
      Username: usuario,
      Pool: userPool
    }
    const cognitoUser = new CognitoUser(userData);
    await cognitoUser.confirmRegistration(codigoConfirm, true, (err, result) => {
      if (err) {
        dispatch({ type: USER_ERROR, payload: 'CONFIRMACION' });
        window.Swal.fire({
          title: '¡Revise el código ingresado!',
          text: 'El código ingresado no es correcto.',
          icon: 'error',
          confirmButtonText: 'OK!'
        });
      } else {
        dispatch({ type: USER_CONFIRM });
        history.push(`/${home}`);
      }
    });
  }
};

/**
 * Que un usuario entre con sus credenciales
 * @param {string} usuario - nombre de usuario o correo
 * @param {string} contrasenia - contraseña
 */
const loginUsuario = dispatch => {
  return async (usuario, contrasenia) => {
    const authenticationData = {
      Username: usuario,
      Password: contrasenia
    };
    const authenticationDetails = new AuthenticationDetails(authenticationData);
    const userData = {
      Username: usuario,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    await cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {
        dispatch({ type: USER_SIGNIN, payload: cognitoUser.getUsername() });
        history.push(`/${home}`);
      },
      onFailure: err => {
        console.clear();
        dispatch({ type: USER_ERROR, payload: 'LOGIN' });
        window.Swal.fire({
          title: '¡Revise el usuario o la contraseña!',
          text: 'Si aún no se ha registrado, haga click en "Regístrese".',
          icon: 'error',
          confirmButtonText: 'OK!'
        });
      }
    });
  };
};

/** Signin automático si el usuario ya había iniciado sesión pero cerró la página. */
const isUserAuthenticated = dispatch => {
  return async () => {
    const currentUser = await userPool.getCurrentUser();
    if (currentUser) {
      // Primero verificar sesión
      currentUser.getSession((err, session) => {
        if (err) {
          dispatch({ type: USER_ERROR, payload: 'NOUSER' })
        } else {
          if (session.isValid()) {
            dispatch({ type: USER_SIGNIN, payload: currentUser.username });
            dispatch({
              type: USER_VERIFY, payload: {
                sessionToken: session.getIdToken().getJwtToken(),
                accessToken: session.getAccessToken().getJwtToken()
              }
            });
          }
        }
      });
    }
  };
};

/**
 * 
 * @param {string} accessToken - access token obtenido del usuario
 * @param {string} sessionToken - id token obtenido del usuario
 */
const lastLocation = dispatch => {
  return async (sessionToken, accessToken) => {
    // Obtener ahora último registro
    const response = await axios.get(`/vehiculo?accessToken=${accessToken}`, {
      headers: { 'Authorization': sessionToken }
    });
    if (response.data.Item) {
      const { UserId, lat, long, placas } = response.data.Item;
      dispatch({ type: UPDATE_VEHI, payload: { id: UserId.S, placas: placas.S, lat: lat.N, long: long.N } });
    }
  }
}

/** Que el usuario cierre sesión */
const logoutUsuario = dispatch => {
  return async () => {
    const currentUser = await userPool.getCurrentUser();
    if (currentUser) currentUser.signOut();

    window.localStorage.clear();
    dispatch({ type: USER_SIGNOUT });
    history.push('/');
  };
};

/**
 * Guardar o reemplazar los datos en la base
 * @param {string} username - id del vehículo
 * @param {string} placas - número de placas
 * @param {number} lat - latitud de la ubicación
 * @param {number} long - longitud de la ubicación
 */
const actualizarVehiculo = dispatch => {
  return async (sessionToken, placas, lat, long) => {
    const response = await axios.post('/vehiculo', {
      placas,
      lat: Number(lat),
      long: Number(long)
    },
      {
        headers: {
          'Authorization': sessionToken,
          'content-type': 'application/json'
        }
      });
    if (response.data) {
      dispatch({ type: UPDATE_VEHI, payload: { id: response.data, placas, lat, long } });
    }
  };
};

export const { Contexto, Proveedor } = crearContextoDatos(
  reducerSignIn,
  {
    loginUsuario, logoutUsuario, registrarNuevoUsuario, confirmarUsuario, isUserAuthenticated,
    actualizarVehiculo, lastLocation
  },
  {
    userUid: null, login: false, errorGeneral: null, sessionToken: null, accessToken: null,
    idVehiculo: '', placasVehiculo: '', latVevhiculo: 0, longVehiculo: 0
  }
);