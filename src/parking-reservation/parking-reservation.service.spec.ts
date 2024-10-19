import { Test, TestingModule } from '@nestjs/testing';
import { ParkingReservationService } from './parking-reservation.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ParkingReservation,
  ParkingReservationSchema,
} from './schemas/parking-reservation.schema';
import { imports } from 'test/setup';

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

  it('findOneByPlate', async () => {
    await service.create({
      plate: 'aab-1234',
    });

    const result = await service.findOneByPlate('aab-1234');

    expect(result).toHaveProperty('_id');
    expect(result).toHaveProperty('plate', 'aab-1234');
  });

  it('findOneByPlate - not found', async () => {
    const result = await service.findOneByPlate('aac-1234');

    expect(result).toBeNull();
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
      expect(error).toHaveProperty('code', 11000);
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
});
