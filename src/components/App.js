import React, { useContext, useEffect } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import history from './navegacion';

import './App.css';

import { Contexto as UsuariosContext } from './contexto/UsuariosContext';

import { home, registro } from './acciones/pantallasNombres';
import Login from './pantallas/Login';
import Home from './pantallas/Home';
import Registro from './pantallas/Registro';

const App = () => {
  const { state: { userUid, login }, isUserAuthenticated } = useContext(UsuariosContext);

  useEffect(() => {
    isUserAuthenticated();
    // eslint-disable-next-line
  }, []);
  
  return (
    <Router history={history}>
      <Switch>
        <Route path='/' exact component={Login}>
          {userUid && login && (<Redirect to={`/${home}`} />)}
        </Route>
        <Route path={`/${registro}`} exact component={Registro}>
          {userUid && login && (<Redirect to={`/${home}`} />)}
        </Route>
        <Route path={`/${home}`} exact component={Home}>
          {!userUid && (<Redirect to='/' />)}
        </Route>
      </Switch>
    </Router>
  );
};

export default App;