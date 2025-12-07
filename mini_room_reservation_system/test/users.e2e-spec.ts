import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from 'src/database/database.service';
import { DatabaseModule } from 'src/database/database.module';

describe('Users E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createdUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = app.get(PrismaService);
    await app.init();

    // Clean DB before running tests — adjust table names to your schema
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  // ---------------------------
  // CREATE USER
  // ---------------------------
  it('POST /users → should create a user', async () => {
    const response = await request(app.getHttpServer())
      .post('/users')
      .send({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Mahmoud',
        lastName: 'Tester',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    createdUserId = response.body.id;
  });

  // ---------------------------
  // GET ALL USERS
  // ---------------------------
  it('GET /users → should return users list', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // ---------------------------
  // GET USER BY ID
  // ---------------------------
  it('GET /users/:id → should return a single user', async () => {
    const response = await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(200);

    expect(response.body.id).toBe(createdUserId);
    expect(response.body.email).toBe('test@example.com');
  });

  // ---------------------------
  // UPDATE USER
  // ---------------------------
  it('PATCH /users/:id → should update user', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/users/${createdUserId}`)
      .send({
        firstName: 'UpdatedName',
      })
      .expect(200);

    expect(response.body.firstName).toBe('UpdatedName');
  });

  // ---------------------------
  // DELETE USER
  // ---------------------------
  it('DELETE /users/:id → should delete user', async () => {
    await request(app.getHttpServer())
      .delete(`/users/${createdUserId}`)
      .expect(200);

    // Verify user is gone
    await request(app.getHttpServer())
      .get(`/users/${createdUserId}`)
      .expect(404);
  });
});
