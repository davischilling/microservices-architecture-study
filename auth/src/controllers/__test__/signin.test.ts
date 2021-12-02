import request from 'supertest'
import app from '../../app'

it('Fails when email that doesn\'t exist is supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'valid_password'
    })
    .expect(400)
})

it('Fails when an incorrect password is supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'valid_password'
    })
    .expect(201)

    await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'invalid_password'
    })
    .expect(400)
})

it('Responds with a cookie when valid credentials are supplied', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'valid_password'
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'valid_password'
    })
    .expect(200)

  expect(response.get('Set-Cookie')).toBeDefined()
})