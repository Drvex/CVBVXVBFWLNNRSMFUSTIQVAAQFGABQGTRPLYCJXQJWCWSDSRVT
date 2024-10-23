import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService {
	private client: Client;

	constructor(private configService: ConfigService) {
		this.init();
	}

	private async init() {
		try {
			this.client = new Client({
				host: this.configService.get<string>('DB_HOST') || 'localhost',
				user: this.configService.get<string>('DB_USERNAME'),
				password: this.configService.get<string>('DB_PASSWORD'),
				port: this.configService.get<number>('DB_PORT') || 5432,
			});

			await this.client.connect();

			const table = this.configService.get<string>('DB_NAME');

			const result = await this.client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [table]);
			if (result.rows.length === 0) await this.client.query(`CREATE DATABASE ${table}`);
			this.client.end();

			this.client = new Client({
				host: this.configService.get<string>('DB_HOST'),
				user: this.configService.get<string>('DB_USERNAME'),
				password: this.configService.get<string>('DB_PASSWORD'),
				port: this.configService.get<number>('DB_PORT'),
				database: table,
			});

			await this.client.connect();

			const createUserTable = `
                CREATE TABLE IF NOT EXISTS users (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(50) NOT NULL,
                  surname VARCHAR(50) NOT NULL,
                  email VARCHAR(100) UNIQUE NOT NULL,
                  password VARCHAR(100) NOT NULL,
                  phone VARCHAR(20),
                  age INT,
                  country VARCHAR(50),
                  district VARCHAR(50),
                  role VARCHAR(50),
                  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;
			await this.client.query(createUserTable);

			const insertMockData = `
                INSERT INTO users (name, surname, email, password, phone, age, country, district, role) 
                VALUES 
                ('Mach', 'Ironman', 'mach.ironman@example.com', '${await bcrypt.hash('pass1', 10)}', '1234567890', 19, 'USA', 'New York', 'admin'),
                ('Jhon', 'Leen', 'json.leen@example.com', '${await bcrypt.hash('pass2', 10)}', '0987654321', 21, 'TR', 'Istanbul', 'user'),
				('Marcus', 'Leon', 'marcus.leon@example.com', '${await bcrypt.hash('pass3', 10)}', '0987654321', 25, 'UK', 'London', 'user')
            `;
			const checkMockData = await this.client.query(`SELECT COUNT(*) FROM users`);
			if (checkMockData.rows.length === 0) await this.client.query(insertMockData);
		} catch (error) {
			console.error('Database initialization error:', error);
		}
	}

	public getClient() {
		return this.client;
	}
}
