import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { WorksModule } from './works/works.module';
import { EspisodesModule } from './espisodes/espisodes.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, WorksModule, EspisodesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
