import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { DatabaseService } from "./database.service";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller("users")
export class UserController {
  constructor(private readonly databaseService: DatabaseService) {}

  // GET /users
  @Get()
  async getUsers(
    @Query("page") page: number = 1,
    @Query("pageSize") pageSize: number = 10,
    @Query("search") search?: string
  ) {
    page = Math.max(page, 1);
    pageSize = Math.max(pageSize, 1);
    const offset = (page - 1) * pageSize;

    const searchQuery =
      search && search !== "undefined"
        ? `WHERE name ILIKE $1 OR surname ILIKE $1`
        : "";

    const params = search ? [`%${search}%`] : [];

    const usersQuery = `
		  SELECT * FROM users ${searchQuery}
		  LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

    const totalCountQuery = `SELECT COUNT(*) as total_count FROM users ${searchQuery}`;

    const usersParams = [...params, pageSize, offset];
    const users = await this.databaseService
      .getClient()
      .query(usersQuery, usersParams);

    const totalCountResult = await this.databaseService
      .getClient()
      .query(totalCountQuery, params);
    const totalCount = parseInt(totalCountResult.rows[0].total_count, 10);

    return {
      users: users.rows,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  }

  // GET /users/:id
  @Get(":id")
  async getUserById(@Param("id") id: number) {
    if (!id) throw new BadRequestException("Id is required!");

    const query = "SELECT * FROM users WHERE id = $1";
    const result = await this.databaseService.getClient().query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    return result.rows[0];
  }

  // POST /users/save
  @Post("save")
  async createUser(@Body() data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const query = `
			  INSERT INTO users (name, surname, email, password, phone, age, country, district, role)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
		  `;

    const result = await this.databaseService
      .getClient()
      .query(query, [
        data.name,
        data.surname,
        data.email,
        hashedPassword,
        data.phone,
        data.age,
        data.country,
        data.district,
        data.role,
      ]);

    return result.rows[0];
  }

  // POST /users/update/:id
  @Post("update/:id")
  async updateUser(@Param("id") id: number, @Body() data: UpdateUserDto) {
    const fieldsToUpdate: string[] = [];
    const valuesToUpdate: any[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (value) {
        if (key === "password") {
          const hashedPassword = await bcrypt.hash(value, 10);
          fieldsToUpdate.push(`${key} = $${valuesToUpdate.length + 1}`);
          valuesToUpdate.push(hashedPassword);
        } else if (key !== "id") {
          fieldsToUpdate.push(`${key} = $${valuesToUpdate.length + 1}`);
          valuesToUpdate.push(value);
        }
      }
    }

    if (fieldsToUpdate.length === 0) {
      throw new BadRequestException("No fields to update.");
    }

    const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = $${valuesToUpdate.length + 1} RETURNING *`;
    valuesToUpdate.push(id);

    const result = await this.databaseService
      .getClient()
      .query(query, valuesToUpdate);

    if (result.rows.length === 0) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    return result.rows[0];
  }

  // DELETE /users/:id
  @Delete(":id")
  async deleteUser(@Param("id") id: number) {
    if (!id) throw new BadRequestException("Id is required!");

    const query = "DELETE FROM users WHERE id = $1 RETURNING *";
    const result = await this.databaseService.getClient().query(query, [id]);

    if (result.rows.length === 0) {
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    return {
      message: `User with id ${id} has been deleted.`,
      user: result.rows[0],
    };
  }
}
