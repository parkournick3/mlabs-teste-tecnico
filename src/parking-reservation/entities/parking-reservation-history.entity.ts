import { Exclude, Expose, Transform } from 'class-transformer';
import dayjs from 'dayjs';

export class ParkingReservationHistoryEntity {
  @Transform(({ value }) => value.toString())
  _id: string;

  paid: boolean;
  left: boolean;

  @Exclude()
  plate: string;

  @Exclude({ toPlainOnly: true })
  entryTime: Date;

  @Exclude({ toPlainOnly: true })
  exitTime: Date;

  @Expose()
  time(): string {
    if (!this.exitTime) {
      return 'still parked';
    }

    return dayjs.duration(dayjs(this.exitTime).diff(this.entryTime)).humanize();
  }

  constructor(partial: Partial<ParkingReservationHistoryEntity>) {
    Object.assign(this, partial);
  }
}
