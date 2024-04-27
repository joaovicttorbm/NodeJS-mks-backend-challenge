import { Router } from "express";
import { FilmController } from "./controller/FilmController";
import { UserController } from "./controller/UserController";

const routes = Router();

const filmRepository = new FilmController();
const userRepository = new UserController();
routes.get("/film", filmRepository.getAll);
routes.get("/film/:id", filmRepository.getById);
routes.post("/film", filmRepository.create);
routes.put("/film/:id", filmRepository.update);
routes.delete("/film/:id", filmRepository.delete);

routes.get("/user", userRepository.getAll);
routes.get("/user/:id", userRepository.getById);
routes.post("/user", userRepository.create);
routes.put("/user/:id", userRepository.update);
routes.delete("/user/:id", userRepository.delete);

export default routes;
