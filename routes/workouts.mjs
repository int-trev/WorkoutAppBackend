import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import sanitize from "mongo-sanitize";

const router = express.Router();

//getting all the workouts for a given user
router.post("/", async (req, res) => {
  let collection = await db.collection("WorkoutsForUser");
  var cleanedUsername = sanitize(req.body.username);
  let results = await collection.find({username: cleanedUsername}).toArray();
  if(results == null || results.length == 0)
  {
    res.send("no results").status(404);
  }
  else
  {
    res.send(results).status(200);
  }
});

//getting a specific workout
router.get("/:id", async (req, res) => {
  let collection = await db.collection("WorkoutsForUser");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

//creating a workout for the day
router.post("/create", async (req, res) => {
    var today = new Date();
    let newDocument = {
      username: req.body.username,
      date: today.toDateString(),
      pushup: req.body.pushup,
      situp: req.body.situp,
      squat: req.body.squat,
      gym: req.body.gym,
      split: req.body.split
    };
    let collection = await db.collection("WorkoutsForUser");
    let initialQueryResults = await collection.find({username: req.body.username, date: today.toDateString()}).toArray();
    if(initialQueryResults == null || initialQueryResults.length == 0)
    {
      let result = await collection.insertOne(newDocument);
      res.status(204).send(result);
    }
    else
    {
      res.status(400).send("There is already a workout logged for today");
    }
  });

//update a workout
router.patch("/", async (req, res) => {
  const query = { _id: new ObjectId(req.body._id) };
  const updates =  {
    $set: {
      username: req.body.username,
      date: req.body.date,
      pushup: req.body.pushup,
      situp: req.body.situp,
      squat: req.body.squat,
      gym: req.body.gym,
      split: req.body.split
    }
  };

  let collection = await db.collection("WorkoutsForUser");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

//delete a workout
router.delete("/", async (req, res) => {
  const query = { _id: new ObjectId(req.body.id) };

  const collection = db.collection("WorkoutsForUser");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});



/*

// This section will help you get a single record by id
router.get("/:id", async (req, res) => {
  let collection = await db.collection("records");
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

// This section will help you create a new record.
router.post("/", async (req, res) => {
  let newDocument = {
    name: req.body.name,
    position: req.body.position,
    level: req.body.level,
  };
  let collection = await db.collection("records");
  let result = await collection.insertOne(newDocument);
  res.send(result).status(204);
});

// This section will help you update a record by id.
router.patch("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };
  const updates =  {
    $set: {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level
    }
  };

  let collection = await db.collection("records");
  let result = await collection.updateOne(query, updates);

  res.send(result).status(200);
});

// This section will help you delete a record
router.delete("/:id", async (req, res) => {
  const query = { _id: new ObjectId(req.params.id) };

  const collection = db.collection("records");
  let result = await collection.deleteOne(query);

  res.send(result).status(200);
});
*/

export default router;