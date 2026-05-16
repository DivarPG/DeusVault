import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CollectionsModule } from './collections/collections.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, CollectionsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
