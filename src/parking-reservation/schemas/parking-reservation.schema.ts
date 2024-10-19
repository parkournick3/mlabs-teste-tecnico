import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ParkingReservationDocument = ParkingReservation & Document;

@Schema({
  versionKey: false,
})
export class ParkingReservation {
  @Prop({ required: true, match: /^[a-zA-Z]{3}-\d{4}/ })
  plate: string;

  @Prop({ default: false })
  paid: boolean;

  @Prop({ default: false })
  left: boolean;

  @Prop({ default: Date.now })
  entryTime: Date;

  @Prop({ default: null, type: Date })
  exitTime: Date;
}

export const ParkingReservationSchema =
  SchemaFactory.createForClass(ParkingReservation);
