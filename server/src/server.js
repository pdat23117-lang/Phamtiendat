const express =
  require("express");
const cors =
  require("cors");
const dotenv =
  require("dotenv");

const connectDB =
  require("./config/db");

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.listen(
  process.env.PORT,
  () => {
    console.log(
      "Server chạy cổng 5000"
    );
  }
);