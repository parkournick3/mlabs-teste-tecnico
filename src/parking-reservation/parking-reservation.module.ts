import { Module } from '@nestjs/common';
import { ParkingReservationService } from './parking-reservation.service';
import { ParkingReservationController } from './parking-reservation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ParkingReservation,
  ParkingReservationSchema,
} from './schemas/parking-reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ParkingReservation.name, schema: ParkingReservationSchema },
    ]),
  ],
  providers: [ParkingReservationService],
  controllers: [ParkingReservationController],
})
export class ParkingReservationModule {}
