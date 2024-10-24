import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Client } from "pg";
import * as bcrypt from "bcrypt";

@Injectable()
export class DatabaseService {
  private client: Client;

  constructor(private configService: ConfigService) {
    this.init();
  }

  private async init() {
    try {
      this.client = new Client({
        host: this.configService.get<string>("DB_HOST") || "localhost",
        user: this.configService.get<string>("DB_USERNAME"),
        password: this.configService.get<string>("DB_PASSWORD"),
        port: this.configService.get<number>("DB_PORT") || 5432,
      });

      await this.client.connect();

      const databaseName = this.configService.get<string>("DB_NAME");
      const checkDbResult = await this.client.query(
        `SELECT 1 FROM pg_database WHERE datname = $1`,
        [databaseName]
      );

      if (checkDbResult.rows.length === 0) {
        await this.client.query(`CREATE DATABASE ${databaseName}`);
        console.log(`Database '${databaseName}' created.`);
      } else {
        console.log(`Database '${databaseName}' already exists.`);
      }

      await this.client.end();

      this.client = new Client({
        host: this.configService.get<string>("DB_HOST") || "localhost",
        user: this.configService.get<string>("DB_USERNAME"),
        password: this.configService.get<string>("DB_PASSWORD"),
        port: this.configService.get<number>("DB_PORT") || 5432,
        database: databaseName,
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

      const checkMockData = await this.client.query(
        `SELECT COUNT(*) FROM users`
      );

      if (parseInt(checkMockData.rows[0].count, 10) === 0) {
        const insertMockData = `
          INSERT INTO users (name, surname, email, password, phone, age, country, district, role) 
          VALUES 
          ('Mach', 'Ironman', 'mach.ironman@example.com', '${await bcrypt.hash("pass1", 10)}', '1234567890', 19, 'USA', 'New York', 'admin'),
          ('Jhon', 'Leen', 'json.leen@example.com', '${await bcrypt.hash("pass2", 10)}', '0987654321', 21, 'TR', 'Istanbul', 'user'),
          ('Marcus', 'Leon', 'marcus.leon@example.com', '${await bcrypt.hash("pass3", 10)}', '0987234231', 25, 'UK', 'London', 'user'),
          ('Furkan', 'Yazan', 'f.yazan@example.com', '${await bcrypt.hash("pass5", 10)}', '09875268746', 20, 'USA', 'Philadelphia', 'user'),
          ('Jane', 'Kelly', 'j.kelly@example.com', '${await bcrypt.hash("pass1245", 10)}', '09545786354', 40, 'USA', 'Vermont', 'user'),
          ('Jhonny', 'Depp', 'j.depp@example.com', '${await bcrypt.hash("passwords233", 10)}', '097543587412', 61, 'USA', 'Kentucky', 'user')
        `;
        await this.client.query(insertMockData);
        console.log("Mock data inserted into 'users' table.");
      } else {
        console.log("Mock data already exists in 'users' table.");
      }
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  public getClient() {
    return this.client;
  }
}
