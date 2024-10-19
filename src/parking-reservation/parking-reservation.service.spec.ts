import { Test, TestingModule } from '@nestjs/testing';
import { ParkingReservationService } from './parking-reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ParkingReservation,
  ParkingReservationSchema,
} from './schemas/parking-reservation.schema';
import { imports } from 'test/setup';
import {
  ReservationAlreadyExistsException,
  ReservationAlreadyLeftException,
  ReservationAlreadyPaidException,
  ReservationNotFoundException,
  ReservationNotPaidException,
} from './exceptions';
import mongoose from 'mongoose';

describe('ParkingReservationService', () => {
  let service: ParkingReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingReservationService],
      imports: [
        ...imports,
        MongooseModule.forFeature([
          { name: ParkingReservation.name, schema: ParkingReservationSchema },
        ]),
      ],
    }).compile();

    service = module.get<ParkingReservationService>(ParkingReservationService);
  });

  it('create', async () => {
    const result = await service.create({
      plate: 'aaa-1234',
    });

    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('plate', 'aaa-1234');
  });

  it('findById', async () => {
    const parkingReservation = await service.create({
      plate: 'aab-1234',
    });

    const result = await service.findById(parkingReservation._id.toString());

    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('plate', 'aab-1234');
  });

  it('findById - not found', async () => {
    try {
      const generatedId = new mongoose.Types.ObjectId();
      await service.findById(generatedId.toString());
    } catch (error) {
      expect(error).instanceOf(ReservationNotFoundException);
    }
  });

  it('create - duplicate', async () => {
    await service.create({
      plate: 'aad-1234',
    });

    try {
      await service.create({
        plate: 'aad-1234',
      });
    } catch (error) {
      expect(error).instanceOf(ReservationAlreadyExistsException);
    }
  });

  it('create - invalid plate', async () => {
    try {
      await service.create({
        plate: '1234',
      });
    } catch (error) {
      expect(error).toHaveProperty('errors.plate');
    }
  });

  it('pay - not found', async () => {
    try {
      const generatedId = new mongoose.Types.ObjectId();
      await service.pay(generatedId.toString());
    } catch (error) {
      expect(error).instanceOf(ReservationNotFoundException);
    }
  });

  it('leave - not found', async () => {
    try {
      const generatedId = new mongoose.Types.ObjectId();
      await service.leave(generatedId.toString());
    } catch (error) {
      expect(error).instanceOf(ReservationNotFoundException);
    }
  });

  it('leave - already left', async () => {
    const parkingReservation = await service.create({
      plate: 'aae-1234',
    });

    await service.pay(parkingReservation._id.toString());

    await service.leave(parkingReservation._id.toString());

    try {
      await service.leave(parkingReservation._id.toString());
    } catch (error) {
      expect(error).instanceOf(ReservationAlreadyLeftException);
    }
  });

  it('leave - not paid', async () => {
    const parkingReservation = await service.create({
      plate: 'aaf-1234',
    });

    try {
      await service.leave(parkingReservation._id.toString());
    } catch (error) {
      expect(error).instanceOf(ReservationNotPaidException);
    }
  });

  it('pay - already paid', async () => {
    const parkingReservation = await service.create({
      plate: 'aag-1234',
    });

    await service.pay(parkingReservation._id.toString());

    try {
      await service.pay(parkingReservation._id.toString());
    } catch (error) {
      expect(error).instanceOf(ReservationAlreadyPaidException);
    }
  });

  it('pay', async () => {
    const parkingReservation = await service.create({
      plate: 'aah-1234',
    });

    await service.pay(parkingReservation._id.toString());

    const result = await service.findById(parkingReservation._id.toString());

    expect(result).toHaveProperty('paid', true);
  });

  it('leave', async () => {
    const parkingReservation = await service.create({
      plate: 'aai-1234',
    });

    await service.pay(parkingReservation._id.toString());

    await service.leave(parkingReservation._id.toString());

    const result = await service.findById(parkingReservation._id.toString());

    expect(result).toHaveProperty('left', true);
  });

  it('leave - exitTime', async () => {
    const parkingReservation = await service.create({
      plate: 'aaj-1234',
    });

    await service.pay(parkingReservation._id.toString());

    await service.leave(parkingReservation._id.toString());

    const result = await service.findById(parkingReservation._id.toString());

    expect(result).toHaveProperty('exitTime');
  });
});
