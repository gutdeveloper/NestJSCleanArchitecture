import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/infrastructure/services/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();
    server = app.getHttpServer();
  });

  afterAll(async () => {
    await prismaService.user.deleteMany({
      where: {
        email: {
          in: ['test@example.com', 'test2@example.com'],
        },
      },
    });

    await prismaService.$disconnect();
    await app.close();
  });

  describe('Auth Flow', () => {
    it('should register a new user', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('email', 'test@example.com');

      await prismaService.user.update({
        where: { email: 'test@example.com' },
        data: { email_verified: true },
      });
    });

    it('should login with registered user', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      authToken = response.body.token;
      console.log(authToken);
    });

    it('should get user profile with valid token', async () => {
        console.log('auth token', authToken)
      const response = await request(server)
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      console.log('response body', response.body);



      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('first_name', 'Test');
      expect(response.body).toHaveProperty('last_name', 'User');
    });

    it('should not get profile without token', async () => {
      await request(server).get('/auth/profile').expect(401);
    });

    it('should not get profile with invalid token', async () => {
      await request(server)
        .get('/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });
});
