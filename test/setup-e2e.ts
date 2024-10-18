import 'dotenv/config';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { ParkingReservationModule } from '@/parking-reservation/parking-reservation.module';

export const DATABASE_URL =
  process.env.TEST_DATABASE_URL ||
  'mongodb://root:password@localhost:27017/parking-test?authSource=admin';

beforeAll(async () => {
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
