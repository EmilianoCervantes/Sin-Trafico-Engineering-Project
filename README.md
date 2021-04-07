# engineering-project
Engineering Project

## Aplicación de Rastreo

El objetivo es construir una applicación web donde se administre una flotilla de vehiculos y se pueda ver su posición.
Cada vehiculo tiene los siguientes datos:

1. Id de Vehiculo
2. Placas
3. Ultima posición conocida (lat,lon)

## Requerimientos

1. Construir un API HTTP Rest con  en la que se pueda 
 - Insertar un vehiculo.
 - Actualizar un vehiculo.
 - Borrar cada Vehículo.
2. La aplicación web y el API deben de contar con autenticación de usuario. (Con nombre de usuario y contraseña es suficiente)
3. La Aplicación web debe de contar con una sola vista, en esta vista debe haber un mapa en donde se muestren los vehiculos de cada usuario.
4. Cada Usuario solo debe de poder interactuar con los vehiculos creados por él mismo.

# Instalaciones
- Emplear ```yarn install```

## Dependencias instaladas por terminal:
1. yarn add react-router-dom
2. yarn add axios
3. yarn add history
4. yarn add amazon-cognito-identity-js
4. yarn add react-google-maps

## Dependencias por cdn/ script externo en el index.html
1. Sweet Alert 2.9 [x]