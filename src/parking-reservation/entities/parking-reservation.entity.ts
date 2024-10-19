import { Exclude, Transform } from 'class-transformer';

export class ParkingReservationEntity {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Exclude()
  entryTime: Date;

  @Exclude()
  exitTime: Date;

  @Exclude()
  left: boolean;

  @Exclude()
  paid: boolean;

  @Exclude()
  plate: string;

  constructor(partial: Partial<ParkingReservationEntity>) {
    Object.assign(this, partial);
  }
}
