import { Controller, Post, Body, Get, Delete, Put } from "@nestjs/common";
import { Request, Response } from "express";
import { userRepository } from "../repositories/UserReposirory";
import { CreateUserDto } from "../dto/CreateUserDto";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { BadRequestError, NotFoundError } from "../helpers/api-erros";
import { getRedis, setRedis } from "../redisConfig";

@Controller("Users")
export class UserController {
  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Usuários]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *       400:
   *         description: Dados do usuário inválidos
   *       409:
   *         description: Usuário já existe
   */
  @Post()
  async create(req: Request, res: Response) {
    const { name, email, password }: CreateUserDto = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError("Invalid name, email or password");
    }

    const userExists = await userRepository.findOneBy({ email });

    if (userExists) {
      throw new BadRequestError("User already exists");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await userRepository.save(newUser);

    const { password: _, ...user } = newUser;

    // const users = await userRepository.find();
    // await setRedis("users", JSON.stringify(users));

    return res.status(201).json(user);
  }

  /**
   * @swagger
   * /users/login:
   *   post:
   *     summary: Autentica um usuário
   *     tags: [Usuários]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 description: Email do usuário
   *               password:
   *                 type: string
   *                 description: Senha do usuário
   *     responses:
   *       200:
   *         description: Usuário autenticado com sucesso
   *       400:
   *         description: Email ou senha inválidos
   */
  @Post()
  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const userExists = await userRepository.findOneBy({ email });

    if (!userExists) {
      throw new BadRequestError("Email or password invalid");
    }

    const verefyPassword = await bcrypt.compare(password, userExists.password);

    if (!verefyPassword) {
      throw new BadRequestError("Email or password invalid");
    }
    const jwtSecret = process.env.JWT_ENV || "default_secret";

    const token = jwt.sign({ id: userExists.id }, jwtSecret, {
      expiresIn: "8h",
    });

    const { password: _, ...userLogin } = userExists;

    return res.json({
      user: userLogin,
      token: token,
    });
  }

  /**
   * @swagger
   * /users/profile:
   *   get:
   *     summary: Retorna o perfil do usuário autenticado
   *     tags: [Usuários]
   *     security:
   *       - BasicAuth: []
   *     responses:
   *       200:
   *         description: Perfil do usuário autenticado
   */
  @Get()
  async getProfile(req: Request, res: Response) {
    // const cachedUsers = await getRedis("users");
    // if (cachedUsers) {
    //   return res.status(200).json(JSON.parse(cachedUsers));
    // }

    // const users = await userRepository.find();
    // await setRedis("users", JSON.stringify(users));
    const users = await userRepository.find();
    return res.status(200).json(users);
  }
  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Retorna todos os usuários
   *     tags: [Usuários]
   *     responses:
   *       200:
   *         description: Lista de usuários
   */
  @Get()
  async getAll(req: Request, res: Response) {
    const users = await userRepository.find();
    return res.status(200).json(users);
  }
  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Retorna um usuário pelo ID
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID do usuário
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Detalhes do usuário
   *       404:
   *         description: Usuário não encontrado
   */

  @Get(":id")
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    const user = await userRepository.findOneBy({ id: +id });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return res.status(200).json(user);
  }
  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Atualiza um usuário pelo ID
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID do usuário
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDto'
   *     responses:
   *       200:
   *         description: Usuário atualizado com sucesso
   *       400:
   *         description: Dados do usuário inválidos
   *       404:
   *         description: Usuário não encontrado
   */
  @Put(":id")
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      throw new NotFoundError("Invalid name, email or password");

    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser && existingUser.id !== +id) {
      throw new BadRequestError(
        "Another user with the same email already exists"
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await userRepository.update(+id, newUser);

    // const users = await userRepository.find();
    // await setRedis("users", JSON.stringify(users));

    return res.status(200).json({ message: "User updated" });
  }
  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Deleta um usuário pelo ID
   *     tags: [Usuários]
   *     parameters:
   *       - in: path
   *         name: id
   *         description: ID do usuário
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       204:
   *         description: Usuário deletado com sucesso
   *       404:
   *         description: Usuário não encontrado
   */
  @Delete(":id")
  async delete(req: Request, res: Response) {
    const { id } = req.params;

    const existingUser = await userRepository.findOneBy({ id: +id });
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }
    await userRepository.remove(existingUser);

    // const users = await userRepository.find();
    // await setRedis("users", JSON.stringify(users));

    return res.sendStatus(204);
  }
}
