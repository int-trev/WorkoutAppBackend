import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import user from "./routes/users.mjs";
import workout from "./routes/workouts.mjs"

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", user);
app.use("/workout", workout);

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});