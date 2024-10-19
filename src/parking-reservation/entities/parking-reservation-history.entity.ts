import { Exclude, Expose } from 'class-transformer';

export class ParkingReservationHistoryEntity {
  _id: string;
  paid: boolean;
  left: boolean;

  @Exclude()
  entryTime: Date;

  @Exclude()
  exitTime: Date;

  @Expose()
  get time(): string {
    return `${(this.exitTime.getTime() - this.entryTime.getTime()) / 60000} minutes`;
  }

  constructor(partial: Partial<ParkingReservationHistoryEntity>) {
    Object.assign(this, partial);
  }
}
