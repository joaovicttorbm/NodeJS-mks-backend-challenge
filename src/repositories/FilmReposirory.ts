import { AppDataSource } from "../data-source";
import { Film } from "../entities/Film";

export const  filmRepository = AppDataSource.getRepository(Film)