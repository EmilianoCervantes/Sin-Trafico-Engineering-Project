import React, { useEffect, useContext, useState } from 'react';
import Header from '../modulos/Header';

import { Contexto as UsuariosContext } from '../contexto/UsuariosContext';
import Input from '../modulos/Input';
import Map from '../modulos/Map';

const Home = () => {
  const { state: { sessionToken, accessToken, idVehiculo, placasVehiculo, latVevhiculo, longVehiculo }, actualizarVehiculo, lastLocation } = useContext(UsuariosContext);

  const [placas, setPlacas] = useState('');
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);

  useEffect(() => {
    if (idVehiculo && placasVehiculo && latVevhiculo && longVehiculo) {
      setPlacas(placasVehiculo);
      setLat(latVevhiculo);
      setLong(longVehiculo);
    }
  }, [idVehiculo, placasVehiculo, latVevhiculo, longVehiculo]);

  useEffect(() => {
    if (sessionToken && accessToken) {
      lastLocation(sessionToken, accessToken);
    }
    // eslint-disable-next-line
  }, [accessToken, sessionToken]);

  const handleVehiculo = () => {
    actualizarVehiculo(sessionToken, placas, lat, long);
  }

  return (
    <div className="container">
      <Header />
      <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-6 mx-auto">
          <div className="card my-3">
            <div className="card-header text-center form-group">
              <h2>Tu vehículo</h2>
            </div>
            <div className="card-body text-center">
              <form onSubmit={e => e.preventDefault()} className="form-signin needs-validation mb-3">
                <h4>{idVehiculo ? 'Ultimo Vehículo guardado' : 'No se tienen registros, guarda una nueva ubicación'}</h4>
                {idVehiculo && <p className="mb-3">Id: {idVehiculo}</p>}
                <Input autoFocus id="placas" placeholder="Placas del vehículo" required
                  value={placas}
                  onChange={setPlacas}
                />
                <Input type="number" id="lat" placeholder="Latitud" required
                  value={lat}
                  onChange={setLat}
                />
                <Input type="number" id="long" placeholder="Longitud" required
                  value={long}
                  onChange={setLong}
                />
                <button
                  style={{ color: 'white' }} className="btn btn-lg btn-primary btn-block text-uppercase"
                  type="submit"
                  onClick={handleVehiculo}
                  disabled={!(placas && lat && long)}
                >
                  {idVehiculo ? 'Actualizar' : 'Guardar'}
                </button>
              </form>

              {/* MAPA */}
              {
                lat && long && (
                  <Map
                    googleMapURL= "https://maps.googleapis.com/maps/api/js?v=3.exp&key=AIzaSyBHMOKiJFGjvU-YcnYukq_dhvbAPB665DA"
                    containerElement={<div style={{ height: '400px' }} />}
                    mapElement={<div style={{ height: '100%' }} />}
                    loadingElement={<p>Cargando mapa...</p>}
                    lat={lat}
                    lng={long}
                  />
                )
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;