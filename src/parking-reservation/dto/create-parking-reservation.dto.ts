import { Transform } from 'class-transformer';
import { IsString, Matches } from 'class-validator';

export class CreateParkingReservationDto {
  @IsString()
  @Matches(/^[a-zA-Z]{3}-\d{4}/, {
    message: 'Invalid plate format. Use AAA-0000 format',
  })
  @Transform(({ value }) => value.toUpperCase())
  plate: string;
}
