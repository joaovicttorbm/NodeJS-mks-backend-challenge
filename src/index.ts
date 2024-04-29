import "express-async-errors";
import express from "express";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/error";
import { swaggerDefinition, swaggerOptions } from "./swaggerConfig";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());

  const swaggerSpec = swaggerJSDoc({
    ...swaggerOptions,
    definition: swaggerDefinition,
  });
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

  app.use(routes);

  app.use(errorMiddleware);

  return app.listen(process.env.PORT, () => {
    console.log("listening on port", process.env.PORT);
  });
});
