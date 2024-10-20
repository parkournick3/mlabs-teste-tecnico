import { Test, TestingModule } from '@nestjs/testing';
import { ParkingReservationService } from './parking-reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ParkingReservation,
  ParkingReservationSchema,
} from './schemas/parking-reservation.schema';
import { imports } from 'test/setup';
import {
  ReservationAlreadyLeftException,
  ReservationAlreadyPaidException,
  ReservationAlreadyParkedException,
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
    expect(result).toHaveProperty('plate', 'AAA-1234');
  });

  it('create - it is not possible to create another reservation while the car is still parked', async () => {
    await expect(service.create({ plate: 'aaa-1234' })).rejects.toThrow(
      ReservationAlreadyParkedException,
    );
  });

  it('findById', async () => {
    const parkingReservation = await service.create({
      plate: 'aab-1234',
    });

    const result = await service.findById(parkingReservation._id.toString());

    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('plate', 'AAB-1234');
  });

  it('findById - not found', async () => {
    const generatedId = new mongoose.Types.ObjectId();

    expect(service.findById(generatedId.toString())).rejects.toThrow(
      ReservationNotFoundException,
    );
  });

  it('create - invalid plate', async () => {
    await expect(service.create({ plate: '1234' })).rejects.toThrow();
    try {
      await service.create({
        plate: '1234',
      });
    } catch (error) {
      expect(error).toHaveProperty('errors.plate');
    }
  });

  it('pay - not found', async () => {
    const generatedId = new mongoose.Types.ObjectId();

    await expect(service.pay(generatedId.toString())).rejects.toThrow(
      ReservationNotFoundException,
    );
  });

  it('leave - not found', async () => {
    const generatedId = new mongoose.Types.ObjectId();

    await expect(service.leave(generatedId.toString())).rejects.toThrow(
      ReservationNotFoundException,
    );
  });

  it('leave - already left', async () => {
    const parkingReservation = await service.create({
      plate: 'aae-1234',
    });

    await service.pay(parkingReservation._id.toString());

    await service.leave(parkingReservation._id.toString());

    await expect(
      service.leave(parkingReservation._id.toString()),
    ).rejects.toThrow(ReservationAlreadyLeftException);
  });

  it('leave - not paid', async () => {
    const parkingReservation = await service.create({
      plate: 'aaf-1234',
    });

    await expect(
      service.leave(parkingReservation._id.toString()),
    ).rejects.toThrow(ReservationNotPaidException);
  });

  it('pay - already paid', async () => {
    const parkingReservation = await service.create({
      plate: 'aag-1234',
    });

    await service.pay(parkingReservation._id.toString());

    await expect(
      service.pay(parkingReservation._id.toString()),
    ).rejects.toThrow(ReservationAlreadyPaidException);
  });

  it('leave fill exit time', async () => {
    const parkingReservation = await service.create({
      plate: 'aaa-1244',
    });

    await service.pay(parkingReservation._id.toString());

    await service.leave(parkingReservation._id.toString());

    const result = await service.findById(parkingReservation._id.toString());

    expect(result).toHaveProperty('exitTime');
    expect(result.exitTime).toBeInstanceOf(Date);
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

  it('getHistory', async () => {
    await service.create({
      plate: 'aak-1234',
    });

    const result = await service.getHistory('aak-1234');

    expect(result).toHaveLength(1);
  });

  it('getHistory - not found', async () => {
    await expect(service.getHistory('aaz-1234')).rejects.toThrow(
      ReservationNotFoundException,
    );
  });

  it('getHistory - multiple', async () => {
    const parkingReservation = await service.create({
      plate: 'aaa-0002',
    });

    await service.pay(parkingReservation._id.toString());

    await service.leave(parkingReservation._id.toString());

    await service.create({
      plate: 'aaa-0002',
    });

    const result = await service.getHistory('aaa-0002');

    expect(result).toHaveLength(2);
  });
});
