import { Injectable } from '@nestjs/common';
import { CreateParkingReservationDto } from './dto/create-parking-reservation.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  ParkingReservation,
  ParkingReservationDocument,
} from './schemas/parking-reservation.schema';
import { Model } from 'mongoose';
import {
  ReservationAlreadyLeftException,
  ReservationAlreadyPaidException,
  ReservationAlreadyParkedException,
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
    const parkingReservations = await this.parkingReservationModel.find({
      plate: createParkingReservationDto.plate.toUpperCase(),
    });

    parkingReservations.forEach((parkingReservation) => {
      if (!parkingReservation.left) {
        throw new ReservationAlreadyParkedException();
      }
    });

    return this.parkingReservationModel.create({
      plate: createParkingReservationDto.plate.toUpperCase(),
    });
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

  async getHistory(plate: string) {
    plate = plate.toUpperCase();

    const parkingReservations = await this.parkingReservationModel.find({
      plate,
    });

    if (!parkingReservations.length) {
      throw new ReservationNotFoundException();
    }

    return parkingReservations;
  }
}
