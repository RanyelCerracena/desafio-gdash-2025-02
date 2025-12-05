import { Module, OnModuleInit } from '@nestjs/common';
import { WeatherLogsModule } from './weather-logs/weather-logs.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    }),
    WeatherLogsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [UsersService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    console.log('Verificando Usuário padrão...');

    const defaultEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || '123456';

    try {
      const existingUser = await this.usersService.findOneByEmail(defaultEmail);

      if (!existingUser) {
        await this.usersService.create({
          email: defaultEmail,
          password: defaultPassword,
          role: 'admin',
        });
        console.log(
          `Usuário padrão criado: ${defaultEmail}/${defaultPassword}`,
        );
      } else {
        console.log(`Usuário padrão já existe: ${defaultEmail}`);
      }
    } catch (error) {
      console.error('Erro ao criar o usuário padrão:', error);
    }
  }
}
