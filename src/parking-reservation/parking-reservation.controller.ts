import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  SerializeOptions,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ParkingReservationService } from './parking-reservation.service';
import { CreateParkingReservationDto } from './dto/create-parking-reservation.dto';
import { ParkingReservationEntity } from './entities/parking-reservation.entity';
import {
  ReservationAlreadyLeftException,
  ReservationAlreadyPaidException,
  ReservationAlreadyParkedException,
  ReservationNotFoundException,
  ReservationNotPaidException,
} from './exceptions';
import { ParkingReservationHistoryEntity } from './entities/parking-reservation-history.entity';

@Controller('parking-reservation')
export class ParkingReservationController {
  constructor(
    private readonly parkingReservationService: ParkingReservationService,
  ) {}

  @UsePipes(new ValidationPipe({ transform: true }))
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
      if (error instanceof ReservationAlreadyParkedException) {
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

  @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: ParkingReservationHistoryEntity })
  @Get(':plate')
  async getHistory(@Param('plate') plate: string) {
    try {
      const parkingReservations =
        await this.parkingReservationService.getHistory(plate);
      return parkingReservations.map((reservation) => reservation.toJSON());
    } catch (error) {
      if (error instanceof ReservationNotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }
}
