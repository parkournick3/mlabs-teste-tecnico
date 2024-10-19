import { Injectable } from '@nestjs/common';
import { CreateParkingReservationDto } from './dto/create-parking-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ParkingReservation,
  ParkingReservationDocument,
} from './schemas/parking-reservation.schema';
import { Model } from 'mongoose';
import {
  ReservationAlreadyExistsException,
  ReservationAlreadyLeftException,
  ReservationAlreadyPaidException,
  ReservationNotFoundException,
  ReservationNotPaidException,
} from './exceptions';

@Injectable()
export class ParkingReservationService {
  constructor(
    @InjectModel(ParkingReservation.name)
    private parkingReservationModel: Model<ParkingReservationDocument>,
  ) {}

  async create(createParkingReservationDto: CreateParkingReservationDto) {
    const existingParkingReservation =
      await this.parkingReservationModel.findOne(createParkingReservationDto);

    if (existingParkingReservation) {
      throw new ReservationAlreadyExistsException();
    }

    return this.parkingReservationModel.create(createParkingReservationDto);
  }

  async findById(id: string) {
    const parkingReservation = await this.parkingReservationModel.findById(id);

    if (!parkingReservation) {
      throw new ReservationNotFoundException();
    }

    return parkingReservation;
  }

  async leave(id: string) {
    const parkingReservation = await this.findById(id);

    if (!parkingReservation) {
      throw new ReservationNotFoundException();
    }

    if (parkingReservation.left) {
      throw new ReservationAlreadyLeftException();
    }

    if (!parkingReservation.paid) {
      throw new ReservationNotPaidException();
    }

    parkingReservation.left = true;
    parkingReservation.exitTime = new Date();

    await parkingReservation.save();
  }

  async pay(id: string) {
    const parkingReservation = await this.findById(id);

    if (!parkingReservation) {
      throw new ReservationNotFoundException();
    }

    if (parkingReservation.paid) {
      throw new ReservationAlreadyPaidException();
    }

    parkingReservation.paid = true;

    await parkingReservation.save();
  }
}
