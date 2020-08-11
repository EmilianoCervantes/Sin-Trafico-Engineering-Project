import React from 'react';

const LoginContainer = ({ children, subtitulo }) => {

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div id="CardLogin" className="card card-signin my-3">
            <div className="card-body text-center">
              <div className="form-group">
                <h1>Proyecto take-home</h1>
                <h3>{subtitulo}</h3>
              </div>
              <div className="card-body text-center">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginContainer;