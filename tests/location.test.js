
const server = require('../server');
const request = require('supertest');
const Location = require('../models/location');

const BASE_URL = '/api/v1';

describe('Location tests', () => {

    beforeEach((done) => {
      Location.remove({}, err => {
        done();
      })
    });
  
    afterAll(() => {
      server.close();
    });
    describe('Testing GET endpoints', () => {
        test('should return an empty list of all locations', () => {
            return request(server)
                .get(`${BASE_URL}/locations`)
                .expect(200)
                .expect('Content-Type', /json/)
                    .then(res => {
                    const body = res.body;
                    expect(body.data).toEqual([])
                    });
        });
    
        test('should return all stored locations', (done) => {
          const location = new Location({
            name: 'IMO',
            male: 25,
            female: 30
          });
          location.save((err, location) => {
            request(server).get(`${BASE_URL}/locations`)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
              const body = res.body;
              expect(body.data.length).toEqual(1)
            });
          });
          done();
        });
    
        test('should return a location', () => {
          const location = new Location({
            name: 'Lagos',
            male: 10,
            female: 50
          });
    
          location.save((err, location) => {
            request(server).get(`${BASE_URL}/location/${location._id}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .then(res => {
              expect(res.body).toMatchObject({
                id: expect.any(String),
                female: expect.any(Number),
                male: expect.any(Number),
                name: expect.any(String),
                subLocations: expect.any(Array),
                total: expect.any(Number)
              })
            });
            })
          });
      });
      describe('Test Post endpoints', async () => {
        test('add a location to the database', () => {
              return request(server)
              .post(`${BASE_URL}/locations`)
              .send({
                name: 'Ondo',
                male: 150,
                female: 50
              })
              .set('Accept', 'application/json')
              .expect(201)
              .then(res => {
                expect(res.body.status).toBe('success');
                expect(res.body.data).toMatchObject({
                  id: expect.any(String),
                  female: expect.any(Number),
                  male: expect.any(Number),
                  name: expect.any(String),
                  subLocations: expect.any(Array),
                  total: expect.any(Number)
                })
              });
        });
    
        test('add sub location', (done) => {
          const location = new Location({
            name: 'Abuja',
            male: 70,
            female: 80
          });
    
          location.save((err, location) => {
            request(server).post(`${BASE_URL}/location/${location._id}/sub`)
            .send({
              name: 'Oyo',
              male: 60,
              female: 80
            })
            .expect(201)
            .then(res => {
              expect(res.body.status).toBe('success');
              expect(res.body.data).toMatchObject({
                id: expect.any(String),
                female: expect.any(Number),
                male: expect.any(Number),
                name: expect.any(String),
                subLocations: expect.any(Array),
                total: expect.any(Number)
              })
            });
          });
          done()
        });
    
       test('should fail when body is empty', (done) => {
           request(server)
              .post(`${BASE_URL}/locations`)
              .send({})
              .set('Accept', 'application/json')
              .expect(400)
              .then(res => {
                expect(res.body.message).toBe("Body payload cannot be empty");
              });
              done()
        });
      });
      describe('Test PUT endpoints', () => {
        test('should update location', () => {
          const location = new Location({
            name: 'Festac',
            male: 20,
            female: 50
          });
    
          location.save((err, location) => {
            request(server).put(`${BASE_URL}/location/${location._id}`)
            .send({
              name: 'Maryland',
            })
            .expect(200)
            .then(res => {
              expect(res.body.status).toBe('success');
              expect(res.body.data).toMatchObject({
                id: expect.any(String),
                female: expect.any(Number),
                male: expect.any(Number),
                name: expect.any(String),
                subLocations: expect.any(Array),
                total: expect.any(Number)
              })
            });
          });
        });
      });
      describe('Test Delete endpoint', () => {
        test('should delete the location', (done) => {
          const location = new Location({
            name: 'Jovinite Street',
            male: 50,
            female: 50
          });
    
          location.save((err, loc) => {
            request(server).delete(`${BASE_URL}/location/${loc._id}`)
                .expect(200)
                .then(res => {
                  expect(res.body.message).toBe("Location deleted successfully");
                });
          })
          done()
        });
      });
    })