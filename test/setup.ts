import 'dotenv/config';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingReservationModule } from '@/parking-reservation/parking-reservation.module';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

export const DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  'mongodb://root:password@localhost:27017/parking-test?authSource=admin';

beforeAll(async () => {
  dayjs.extend(duration);
  dayjs.extend(relativeTime);

  await mongoose.connect(DATABASE_URL);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

export const imports = [
  MongooseModule.forRoot(DATABASE_URL),
  ParkingReservationModule,
];
