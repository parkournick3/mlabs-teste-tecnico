import { Injectable } from '@nestjs/common';
import { CreateParkingReservationDto } from './dto/create-parking-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ParkingReservation,
  ParkingReservationDocument,
} from './schemas/parking-reservation.schema';
import { Model } from 'mongoose';

@Injectable()
export class ParkingReservationService {
  constructor(
    @InjectModel(ParkingReservation.name)
    private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  async create(createParkingReservationDto: CreateParkingReservationDto) {
    return this.parkingReservationModel.create(createParkingReservationDto);
  }

  async findOneByPlate(plate: string) {
    return this.parkingReservationModel.findOne({ plate });
  }
}
