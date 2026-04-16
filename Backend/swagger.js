const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'API de Empleados',
        description: 'Documentación de la API para la gestión de Empleados',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};
const outputFile = './swagger_output.json';
const endpointsFiles = ['./server.js']; 

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./server'); 
});