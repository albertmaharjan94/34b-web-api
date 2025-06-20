const request = require("supertest")
const app = require("../index")
const User = require("../models/User")
const mongoose = require("mongoose")

afterAll( async () => {
    await mongoose.disconnect()
})
let authToken

// 1. Describe - What are we testing? (Grouping)
describe(
    "User Authentication API" , 
    ()=> {
        beforeAll( async () => {
            await User.deleteMany({email: "ram2025@gmail.com"})
        })

        // 2. test() Individual Test - What api route are we testing
        test(
            "can validate user while creating user",
            async () => {
                // 3. Actions "Actual api call"
                const res = await request(app)
                    .post("/api/auth/register")
                    .send(
                        {
                            firstName: "Ram",
                            email: "ram2025@gmail.com"
                        }
                    )
                // 4. Expectation - Assertion - What should happen?
                expect(res.statusCode).toBe(400)
                expect(res.body.success).toBe(false)
                expect(res.body.message).toBe("Missing fields")
            }
        )

        // .. more test
        test(
            "can register user with all fields",
            async () => {
                const res = await request(app)
                    .post("/api/auth/register")
                    .send(
                        {
                            firstName: "ram",
                            lastName: "bahadur",
                            username: "ram123",
                            email: "ram2025@gmail.com",
                            password: "password"
                        }
                    )
                expect(res.statusCode).toBe(201)
                expect(res.body.success).toBe(true)
            }
        )

        test(
            "can login user with valid credentials",
            async () => {
                const res = await request(app)
                    .post("/api/auth/login")
                    .send(
                        {
                            email: "ram2025@gmail.com",
                            password: "password"
                        }
                    )
                expect(res.statusCode).toBe(200)
                expect(res.body.success).toBe(true)
                expect(res.body.token).toEqual(expect.any(String))
                authToken = res.body.token
            }
        )
    }
)

describe(
    "Authenticated Admin routes", 
    () => {
        beforeAll( async () => {
            await User.updateOne(
                { email : "ram2025@gmail.com"},
                { $set: { role: "admin" } }
            )
        })
        test(
            "can get users as admin with token",
            async () => {
                const res = await request(app)
                    .get("/api/admin/users")
                    .set("Authorization", "Bearer " + authToken) 
                
                expect(res.statusCode).toBe(200)
                expect(res.body.success).toBe(true)
            }
        )
    }
)