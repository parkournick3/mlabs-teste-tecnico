import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { ParkingReservationService } from './parking-reservation.service';
import { CreateParkingReservationDto } from './dto/create-parking-reservation.dto';
import { ParkingReservationEntity } from './entities/parking-reservation.entity';
import {
  ReservationAlreadyExistsException,
  ReservationAlreadyLeftException,
  ReservationAlreadyPaidException,
  ReservationNotFoundException,
  ReservationNotPaidException,
} from './exceptions';

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
    try {
      const newParkingReservation = await this.parkingReservationService.create(
        createParkingReservationDto,
      );
      return newParkingReservation.toJSON();
    } catch (error) {
      if (error instanceof ReservationAlreadyExistsException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  @Patch(':id/pay')
  async pay(@Param('id') id: string) {
    try {
      await this.parkingReservationService.pay(id);

      return { message: 'Parking reservation paid' };
    } catch (error) {
      if (error instanceof ReservationNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof ReservationAlreadyPaidException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw error;
    }
  }

  @Patch(':id/leave')
  async leave(@Param('id') id: string) {
    try {
      await this.parkingReservationService.leave(id);
      return { message: 'Parking reservation left' };
    } catch (error) {
      if (error instanceof ReservationNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error instanceof ReservationAlreadyLeftException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      if (error instanceof ReservationNotPaidException) {
        throw new HttpException(error.message, HttpStatus.CONFLICT);
      }
      throw error;
    }
  }
}
