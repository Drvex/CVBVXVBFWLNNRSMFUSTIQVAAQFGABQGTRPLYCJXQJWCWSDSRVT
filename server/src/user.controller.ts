import { Controller, Get, Post, Body, Param, Put, Query } from '@nestjs/common';
import { DatabaseService } from './database.service';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
	constructor(private readonly databaseService: DatabaseService) {}

	// GET /users
	@Get()
	async getUsers(@Query('page') page: number = 1, @Query('pageSize') pageSize: number = 10, @Query('search') search?: string) {
		page = Math.max(page, 1);
		pageSize = Math.max(pageSize, 1);
		const offset = (page - 1) * pageSize;

		let searchQuery = '';
		const params: string[] = [];

		if (search && search !== 'undefined') {
			searchQuery = `WHERE name ILIKE $1 OR surname ILIKE $1`;
			params.push(`%${search}%`);
		}

		const usersQuery = `
        SELECT * FROM users ${searchQuery}
        LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

		const totalCountQuery = `SELECT COUNT(*) as total_count FROM users ${searchQuery}`;

		const usersParams = [...params, pageSize, offset];
		const users = await this.databaseService.getClient().query(usersQuery, usersParams);

		const totalCountResult = await this.databaseService.getClient().query(totalCountQuery, params);
		const totalCount = parseInt(totalCountResult.rows[0].total_count, 10);

		return {
			users: users.rows,
			totalCount,
			totalPages: Math.ceil(totalCount / pageSize),
		};
	}

	// GET /users/:id
	@Get(':id')
	async getUserById(@Param('id') id: number) {
		if (!id) throw new Error('Id required!');
		const query = 'SELECT * FROM users WHERE id = $1';
		const result = await this.databaseService.getClient().query(query, [id]);
		return result.rows.length > 0 ? result.rows[0] : null;
	}

	// POST /users/save
	@Post('save')
	async createUser(@Body() data) {
		const query = `
            INSERT INTO users (name, surname, email, password, phone, age, country, district, role)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *
        `;
		const { name, surname, email, password, phone, age, country, district, role } = data;
		const hashed_pass = await bcrypt.hash(password, 10);
		const result = await this.databaseService.getClient().query(query, [name, surname, email, hashed_pass, phone, age, country, district, role]);
		return result.rows[0];
	}

	// POST /users/update/:id
	@Post('update/:id')
	async updateUser(@Param('id') id: number, @Body() data) {
		const fieldsToUpdate: string[] = [];
		const valuesToUpdate: any[] = [];
		for (const [key, value] of Object.entries(data)) {
			if (value) {
				if (key === 'password') {
					const hashed_pass = await bcrypt.hash(value, 10);
					fieldsToUpdate.push(`${key} = $${valuesToUpdate.length + 1}`);
					valuesToUpdate.push(hashed_pass);
				} else if (key === 'id') {
					continue;
				} else {
					fieldsToUpdate.push(`${key} = $${valuesToUpdate.length + 1}`);
					valuesToUpdate.push(value);
				}
			}
		}
		if (fieldsToUpdate && fieldsToUpdate.length === 0) {
			throw new Error('No fields to update.');
		}
		const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = $${valuesToUpdate.length + 1} RETURNING *`;
		valuesToUpdate.push(id);

		const result = await this.databaseService.getClient().query(query, valuesToUpdate);
		return result.rows[0];
	}
}
