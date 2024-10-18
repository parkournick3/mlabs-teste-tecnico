import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

const DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://root:password@localhost:27017/parking';

@Module({
  imports: [MongooseModule.forRoot(DATABASE_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
