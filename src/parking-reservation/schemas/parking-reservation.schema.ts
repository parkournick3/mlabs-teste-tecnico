import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ParkingReservationDocument = ParkingReservation & Document;

@Schema({
  versionKey: false,
})
export class ParkingReservation {
  @ApiProperty()
  @Prop({ required: true, match: /^[a-zA-Z]{3}-\d{4}/ })
  plate: string;

  @ApiProperty()
  @Prop({ default: false })
  paid: boolean;

  @ApiProperty()
  @Prop({ default: false })
  left: boolean;

  @ApiProperty()
  @Prop({ default: Date.now })
  entryTime: Date;

  @ApiProperty()
  @Prop({ default: null, type: Date })
  exitTime: Date;
}

export const ParkingReservationSchema =
  SchemaFactory.createForClass(ParkingReservation);
