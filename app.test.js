const app = require('./app')
const request = require('supertest')
const db = require('./db/connection')
const seed = require('./db/seeds/seed')
const data = require('./db/data/test-data')
const endpointsData = require('./endpoints.json')

beforeEach(() => {
    return seed(data)
   })
   
   afterAll(() => {
       return db.end()
   })


describe("GET /api/topics", () => {
    test("returns status of code 200 when a request is made to this endpoint", () => {
        return request(app).get("/api/topics").expect(200);
    })
    test("Returns topics with the correct format", () => {
        return request(app)
        .get('/api/topics')
        .then(({body}) => {
          const topics = body
          expect(topics).toHaveLength(3)
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string")
            expect(typeof topic.description).toBe("string")
          })
        }) 
    }) 
})

describe("GET /api", () => {
  test("Should respond with an accurate JSON object representing all available endpoints", () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(({body}) => {
      const endpoints = body
      expect(endpoints).toEqual(endpointsData)       
    })
  })
})

test("handles API endpoint not found (404)", () => {
  return request(app)
    .get("/api/nonexistentendpoint")
    .expect(404)
}) 

