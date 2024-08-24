require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
var bodyParser = require("body-parser");

const connectDB = require("./database");

app.all('*', (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://reading-test.vercel.app/");
  next();
});

app.use(
  cors({
    origin: ["http://127.0.0.1:3000", process.env.CLIENT_URL, "http://localhost:5173","https://reading-test.vercel.app"],
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/api/user", require("./routes/UserRoute"));
app.use("/api/result", require("./routes/ResultRoute"));

app.listen(process.env.PORT, () => {
  connectDB();
  console.log(`Server is running on ${process.env.IP}:${process.env.PORT}`);
});
