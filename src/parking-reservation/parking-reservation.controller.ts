import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ParkingReservationService } from './parking-reservation.service';
import { CreateParkingReservationDto } from './dto/create-parking-reservation.dto';
import { ParkingReservationEntity } from './entities/parking-reservation.entity';

@Controller('parking-reservation')
export class ParkingReservationController {
  constructor(
    private readonly parkingReservationService: ParkingReservationService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ParkingReservationEntity })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createParkingReservationDto: CreateParkingReservationDto,
  ) {
    const existingParkingReservation =
      await this.parkingReservationService.findOneByPlate(
        createParkingReservationDto.plate,
      );

    if (existingParkingReservation) {
      throw new HttpException(
        'Parking reservation already exists',
        HttpStatus.CONFLICT,
      );
    }

    const newParkingReservation = await this.parkingReservationService.create(
      createParkingReservationDto,
    );

    return newParkingReservation.toJSON();
  }
}
