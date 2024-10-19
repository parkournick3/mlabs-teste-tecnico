import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { imports } from 'test/setup';

describe('ParkingReservationController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports,
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();
  });

  test('[POST] /parking-reservation (400) - without body', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .expect(400);
  });

  test('[POST] /parking-reservation (400) - with invalid plate', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: '1234' })
      .expect(400);
  });

  test('[POST] /parking-reservation (400) - with invalid plate', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'aaaa-1234' })
      .expect(400);
  });

  test('[POST] /parking-reservation (400) - with invalid plate', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: '1aa-1234' })
      .expect(400);
  });

  test('[POST] /parking-reservation (400) - with invalid plate', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'aaa-a234' })
      .expect(400);
  });

  test('[POST] /parking-reservation (201)', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'aaa-1234' })
      .expect(201);
  });

  test('[POST] /parking-reservation (409) - conflict', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'aaa-1234' })
      .expect(409);
  });

  test('[POST] /parking-reservation (201)', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'SDW-4324' })
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
