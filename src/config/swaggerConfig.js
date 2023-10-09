const swaggerConfig = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'API de Mi Proyecto',
        version: '1.0.0',
        description: 'Descripción de la API de Mi Proyecto',
      },
      servers: [
        {
          url: 'http://localhost:8080', 
        },
      ],
    },
    apis: ['./src/routes/*.js'],  
  };
  
  export default swaggerConfig;