import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { imports } from 'test/setup';

describe('ParkingReservationController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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

  test('[POST] /parking-reservation (201)', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'SDW-4324' })
      .expect(201);
  });

  test('[POST] /parking-reservation (409) - already parked', async () => {
    return request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'SDW-4324' })
      .expect(409);
  });

  test('[PATCH] /parking-reservation/:id/pay (404) - not found', async () => {
    return request(app.getHttpServer())
      .patch('/parking-reservation/123')
      .expect(404);
  });

  test('[PATCH] /parking-reservation/:id/pay (409) - conflict', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'XYZ-1234' })
      .expect(201);

    const reservationId = createResponse.body._id;

    await request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/pay`)
      .expect(200);

    return request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/pay`)
      .expect(409);
  });

  test('[PATCH] /parking-reservation/:id/pay (200) - valid payment', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'XYZ-1235' })
      .expect(201);

    const reservationId = createResponse.body._id;

    await request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/pay`)
      .expect(200);
  });

  test('[PATCH] /parking-reservation/:id/leave - not paid', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'XYZ-1236' })
      .expect(201);

    const reservationId = createResponse.body._id;

    return request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/leave`)
      .expect(409);
  });

  test('[PATCH] /parking-reservation/:id/leave - already left', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'XYZ-1237' })
      .expect(201);

    const reservationId = createResponse.body._id;

    await request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/pay`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/leave`)
      .expect(200);

    return request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/leave`)
      .expect(409);
  });

  test('[PATCH] /parking-reservation/:id/leave (200) - valid leave', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'XYZ-1238' })
      .expect(201);

    const reservationId = createResponse.body._id;

    await request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/pay`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/leave`)
      .expect(200);
  });

  test('[GET] /parking-reservation/:plate (404) - not found', async () => {
    return request(app.getHttpServer())
      .get('/parking-reservation/XYZ-1239')
      .expect(404);
  });

  test('[GET] /parking-reservation/:plate (200) - found', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'XYZ-1239' })
      .expect(201);

    const reservationId = createResponse.body._id;

    await request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/pay`)
      .expect(200);

    await request(app.getHttpServer())
      .patch(`/parking-reservation/${reservationId}/leave`)
      .expect(200);

    await request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'XYZ-1239' })
      .expect(201);

    return request(app.getHttpServer())
      .get('/parking-reservation/XYZ-1239')
      .expect(200);
  });

  test('[GET] /parking-reservation/:plate (200) - still parked', async () => {
    await request(app.getHttpServer())
      .post('/parking-reservation')
      .send({ plate: 'XYZ-1240' })
      .expect(201);

    const result = await request(app.getHttpServer())
      .get('/parking-reservation/XYZ-1240')
      .expect(200);

    expect(result.body[0]).toHaveProperty('time', 'still parked');
  });

  afterAll(async () => {
    await app.close();
  });
});
