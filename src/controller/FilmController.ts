import { Film } from "./../entities/Film";
import { Controller, Post, Body, Get } from "@nestjs/common";
import { Request, Response } from "express";
import { filmRepository } from "../repositories/FilmReposirory";
import { CreateFilmDto } from "../dto/CreateFilmDto";

@Controller("films")
export class FilmController {
  @Post()
  async create(req: Request, res: Response) {
    const { title, description }: CreateFilmDto = req.body;

    if (!title || !description)
      return res.status(400).json({ message: "Invalid title or description" });

    try {
      const existingFilm = await filmRepository.findOneBy({ title });
      if (existingFilm) {
        return res.status(400).json({ message: "Film already exists" });
      }

      const newFilm = filmRepository.create({
        title,
        description,
      });

      await filmRepository.save(newFilm);

      return res.status(201).json(newFilm);
    } catch (error) {
      console.error("Error creating film:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const films = await filmRepository.find();
      return res.status(200).json(films);
    } catch (error) {
      console.error("Error fetching films:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  @Get(":id")
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const film = await filmRepository.findOneBy({ id: +id });
      if (!film) {
        return res.status(404).json({ message: "Film not found" });
      }
      return res.status(200).json(film);
    } catch (error) {
      console.error("Error fetching film by ID:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const existingFilm = await filmRepository.findOneBy({ title });
      if (existingFilm && existingFilm.id !== +id) {
        return res
          .status(400)
          .json({ message: "Another film with the same title already exists" });
      }

      await filmRepository.update(+id, { title, description });

      return res.status(200).json({ message: "Film updated" });
    } catch (error) {
      console.error("Error updating film:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingFilm = await filmRepository.findOneBy({ id: +id });
      if (!existingFilm) {
        return res.status(404).json({ message: "Film not found" });
      }
      await filmRepository.remove(existingFilm);

      return res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting film:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
