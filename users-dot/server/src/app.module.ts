import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DatabaseService } from './database.service';
import { ConfigModule } from '@nestjs/config';
 
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
	],
	controllers: [UserController],
	providers: [DatabaseService],
})
export class AppModule {}
