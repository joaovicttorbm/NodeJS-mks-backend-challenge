import "express-async-errors";
import { Router } from "express";
import { FilmController } from "./controller/FilmController";
import { UserController } from "./controller/UserController";
import { authMiddleware } from "./middlewares/authMiddlewares";

const routes = Router();

const filmRepository = new FilmController();
const userRepository = new UserController();

routes.post("/login", userRepository.login);
routes.get("/film", filmRepository.getAll);

routes.use(authMiddleware);

routes.get("/film/:id", filmRepository.getById);
routes.post("/film", filmRepository.create);
routes.put("/film/:id", filmRepository.update);
routes.delete("/film/:id", filmRepository.delete);

routes.get("/profile", new UserController().getProfile);

routes.get("/user", userRepository.getAll);
routes.get("/user", userRepository.getAll);
routes.get("/user/:id", userRepository.getById);
routes.post("/user", userRepository.create);
routes.put("/user/:id", userRepository.update);
routes.delete("/user/:id", userRepository.delete);

export default routes;
