const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../services/mongo");
const { loadPlanetsData } = require("../../models/planets.model");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
    await loadPlanetsData();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("GET /launches", () => {
    test("It should respond with 200 sent", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });

  describe("POST /launches", () => {
    const newLaunch = {
      mission: "Test Mission",
      rocket: "Test Rocket",
      target: "Kepler-62 f",
      launchDate: "January 4, 2022",
    };
    const newLaunchWithoutDate = {
      mission: "Test Mission",
      rocket: "Test Rocket",
      target: "Kepler-62 f",
    };

    test("It should respond with the 201 created", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(newLaunch)
        .expect(201)
        .expect("Content-Type", /json/);
      const requestDate = new Date(newLaunch.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(newLaunchWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(newLaunchWithoutDate)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send({ ...newLaunch, launchDate: "not a date" })
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
