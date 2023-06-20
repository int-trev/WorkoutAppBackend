import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import sanitize from "mongo-sanitize";
import jwt from "jsonwebtoken";

const router = express.Router();

//sign in for the users
router.post("/signin", async (req, res) => {
  let collection = await db.collection("Information");
  var cleanedUsername = sanitize(req.body.username);
  var cleanedPassword = sanitize(req.body.password);
  let results = await collection.find({username: cleanedUsername , password: cleanedPassword}).toArray();
  if(results == null || results.length == 0)
  {
    res.send({"message":"incorrect username or password"}).status(404);
  }
  else
  {
    var token = jwt.sign({username: results[0].username}, process.env.secret);
    res.send({token: token}).status(200);
  }
});


//need a create user -- which will need to include validation that the username isnt already taken

router.post("/createuser", async (req, res) => {
    var cleanedUsername = sanitize(req.body.username);
    var cleanedPassword = sanitize(req.body.password);
    if(cleanedUsername != req.body.username || cleanedPassword != req.body.password)
    {
        res.send("Invalid username or password trying to be created?").status(400);
    }

    let newDocument = {
      username: cleanedUsername,
      password: cleanedPassword
    };
    let collection = await db.collection("Information");

    let firstQueryResult = await collection.find({username: cleanedUsername}).toArray();
    console.log(firstQueryResult);
    if(firstQueryResult == null || firstQueryResult.length == 0)
    {
        let result = await collection.insertOne(newDocument);
        res.send(result).status(204);
    }
    else
    {
        res.send("The username provided already exists, chose another one.").status(400);
    }

  });


//will do later but will need to make an email field as well as a reset password type of thing

//write a get to get all the documents that contains all the workout information of a user

//write CRUD for the document for the day and the workouts for that day 




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