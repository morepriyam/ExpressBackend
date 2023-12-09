const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const app = express();
const port = 3001;
const cors = require("cors");
// Enable CORS for all routes
app.use(cors());

app.use(express.json());

mongoose
  .connect("Add Your Mongoose Link Here") // This is a structure code , add you own moongoose link
  .then(function () {
    app.listen(port, function () {
      console.log(`Example app listening on port ${port}`);
    });
  })
  .catch(function (error) {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("Backend Startup");
});

//signup and signin is in the users route
app.use("/user", userRouter);

//private routes

//admin routes
