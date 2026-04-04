import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvKeys } from './common/constants/env.keys';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,        
      envFilePath: '../../../.env', 
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get(EnvKeys.DB_HOST),
        port: config.get<number>(EnvKeys.DB_PORT),
        username: config.get(EnvKeys.DB_USERNAME),
        password: config.get(EnvKeys.DB_PASSWORD),
        database: config.get(EnvKeys.DB_NAME),
        autoLoadEntities: true,  
        synchronize: true,       
      }),
    }),
    AuthModule,
    ProjectsModule,
    TasksModule, 
    UsersModule,
  ],
})
export class AppModule {}
