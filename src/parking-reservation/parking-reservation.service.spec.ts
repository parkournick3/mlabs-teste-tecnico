import { Test, TestingModule } from '@nestjs/testing';
import { ParkingReservationService } from './parking-reservation.service';

describe('ParkingReservationService', () => {
  let service: ParkingReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParkingReservationService],
    }).compile();

    service = module.get<ParkingReservationService>(ParkingReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
