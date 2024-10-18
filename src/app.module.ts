import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingReservationModule } from './parking-reservation/parking-reservation.module';

const DATABASE_URL =
  process.env.DATABASE_URL || 'mongodb://localhost:27017/parking';

@Module({
  imports: [MongooseModule.forRoot(DATABASE_URL), ParkingReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
