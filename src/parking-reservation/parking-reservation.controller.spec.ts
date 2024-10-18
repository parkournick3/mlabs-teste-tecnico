import { Test, TestingModule } from '@nestjs/testing';
import { ParkingReservationController } from './parking-reservation.controller';

describe('ParkingReservationController', () => {
  let controller: ParkingReservationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParkingReservationController],
    }).compile();

    controller = module.get<ParkingReservationController>(
      ParkingReservationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
