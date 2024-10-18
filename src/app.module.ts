import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingModule } from './parking/parking.module';

const DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://root:password@localhost:27017/parking';

@Module({
  imports: [MongooseModule.forRoot(DATABASE_URL), ParkingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
