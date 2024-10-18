import { Module } from '@nestjs/common';
import { ParkingReservationService } from './parking-reservation.service';
import { ParkingReservationController } from './parking-reservation.controller';

@Module({
  providers: [ParkingReservationService],
  controllers: [ParkingReservationController],
})
export class ParkingReservationModule {}
