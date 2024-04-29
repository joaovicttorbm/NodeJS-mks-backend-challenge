import { Film } from "./../entities/Film";
import { Controller, Post, Body, Get, Put, Delete } from "@nestjs/common";
import { Request, Response } from "express";
import { filmRepository } from "../repositories/FilmReposirory";
import { CreateFilmDto } from "../dto/CreateFilmDto";
import { BadRequestError, NotFoundError } from "../helpers/api-erros";

@Controller("films")
export class FilmController {
  /**
   * @swagger
   * /films:
   *   post:
   *     summary: Cria um novo filme
   *     tags: [Filmes]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateFilmDto'
   *     responses:
   *       201:
   *         description: Filme criado com sucesso
   *       400:
   *         description: Dados do filme inválidos
   *       409:
   *         description: Filme já existe
   */
  @Post()
  async create(req: Request, res: Response) {
    const { title, description }: CreateFilmDto = req.body;

    if (!title || !description)
      throw new BadRequestError("Invalid title or description");

    const existingFilm = await filmRepository.findOneBy({ title });
    if (existingFilm) {
      throw new BadRequestError("Film already exists");
    }

    const newFilm = filmRepository.create({
      title,
      description,
    });

    await filmRepository.save(newFilm);

    return res.status(201).json(newFilm);
  }
  /**
   * @swagger
   * /films:
   *   get:
   *     summary: Retorna todos os filmes
   *     tags: [Filmes]
   *     responses:
   *       200:
   *         description: Lista de filmes
   */
  async getAll(req: Request, res: Response) {
    const films = await filmRepository.find();
    return res.status(200).json(films);
  }

  /**
   * @swagger
   * /films/{id}:
   *   get:
   *     summary: Retorna um filme pelo ID
   *     tags: [Filmes]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID do filme
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Detalhes do filme
   *       404:
   *         description: Filme não encontrado
   */
  @Get(":id")
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const film = await filmRepository.findOneBy({ id: +id });
    if (!film) {
      throw new BadRequestError("Film not found");
    }
    return res.status(200).json(film);
  }

  /**
   * @swagger
   * /films/{id}:
   *   put:
   *     summary: Atualiza um filme pelo ID
   *     tags: [Filmes]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID do filme
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateFilmDto'
   *     responses:
   *       200:
   *         description: Filme atualizado com sucesso
   *       400:
   *         description: Dados do filme inválidos
   *       404:
   *         description: Filme não encontrado
   */
  @Put()
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description } = req.body;

    const existingFilm = await filmRepository.findOneBy({ title });
    if (existingFilm && existingFilm.id !== +id) {
      throw new BadRequestError(
        "Another film with the same title already exists"
      );
    }

    await filmRepository.update(+id, { title, description });
    return res.status(200).json({ message: "Film updated" });
  }

  /**
   * @swagger
   * /films/{id}:
   *   delete:
   *     summary: Deleta um filme pelo ID
   *     tags: [Filmes]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID do filme
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Filme deletado com sucesso
   *       404:
   *         description: Filme não encontrado
   */
  @Delete()
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const existingFilm = await filmRepository.findOneBy({ id: +id });
    if (!existingFilm) {
      throw new NotFoundError("Film not found");
    }
    await filmRepository.remove(existingFilm);
    return res.sendStatus(204);
  }
}
