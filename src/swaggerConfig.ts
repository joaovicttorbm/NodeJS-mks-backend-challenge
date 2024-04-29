export const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Filmes",
    version: "1.0.0",
    description: "API para gerenciar um catálogo de filmes",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
};

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "API de Filmes",
      version: "1.0.0",
      description: "API para gerenciar um catálogo de filmes",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/controller/*.ts"],
};
