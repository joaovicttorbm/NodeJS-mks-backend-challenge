import { Controller, Post, Body, Get, Delete, Put } from "@nestjs/common";
import { Request, Response } from "express";
import { userRepository } from "../repositories/UserReposirory";
import { CreateUserDto } from "../dto/CreateUserDto";

@Controller("Users")
export class UserController {
  // async create(req: Request, res: Response) {
  // const { name, email, password }: CreateUserDto = req.body;

  // if (!name || !email || !password)
  //   return res
  //     .status(400)
  //     .json({ message: "Invalid name, email or password" });

  // try {
  //   const existingUser = await userRepository.findOneBy({ email });

  //   if (existingUser) {
  //     return res.status(400).json({ message: "User already exists" });
  //   }

  //   const newUser = userRepository.create({
  //     name,
  //     email,
  //     password,
  //   });

  //   await userRepository.save(newUser);

  //   return res.status(201).json(newUser);
  // } catch (error) {
  //   console.error("Error creating user:", error);

  //   return res.status(500).json({ message: "Internal Server Error" });
  // }
  // }

  @Post()
  async create(req: Request, res: Response) {
    const { name, email, password }: CreateUserDto = req.body;

    if (!name || !email || !password)
      return res
        .status(400)
        .json({ message: "Invalid name, email or password" });

    try {
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const newUser = userRepository.create({
        name,
        email,
        password,
      });

      await userRepository.save(newUser);

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  @Get()
  async getAll(req: Request, res: Response) {
    try {
      const users = await userRepository.find();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  @Get(":id")
  async getById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const user = await userRepository.findOneBy({ id: +id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  @Put(":id")
  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
      const existingUser = await userRepository.findOneBy({ email });
      if (existingUser && existingUser.id !== +id) {
        return res
          .status(400)
          .json({ message: "Another user with the same email already exists" });
      }

      await userRepository.update(+id, { name, email, password });

      return res.status(200).json({ message: "User updated" });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  @Delete(":id")
  async delete(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const existingUser = await userRepository.findOneBy({ id: +id });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }
      await userRepository.remove(existingUser);

      return res.sendStatus(204);
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
