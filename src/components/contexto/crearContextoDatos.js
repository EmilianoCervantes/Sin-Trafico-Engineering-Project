import React, { useReducer } from 'react';

export default (reducer, acciones, estadoInicial) => {
  const Contexto = React.createContext();

  const Proveedor = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, estadoInicial);

    const accionesAsociadas = {};
    // eslint-disable-next-line
    for (let key in acciones) {
      accionesAsociadas[key] = acciones[key](dispatch);
    }

    return (
      <Contexto.Provider value={{ state, ...accionesAsociadas }}>
        {children}
      </Contexto.Provider>
    );
  };

  return { Contexto, Proveedor };
};