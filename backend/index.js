const express = require("express");
const { connectMongodb } = require("./connection");
const PORT = 8000;
const app=express();
const cookieParser = require("cookie-parser");
const cors = require("cors");

// routes
const staticRouter = require("./routes/staticRoute")
const userRouter = require("./routes/user");
const expenseRouter = require("./routes/expense");

// const {checkAuth} = require("./middlewares/user")


// connect mongodb
connectMongodb( 'mongodb://127.0.0.1:27017/expense-tracker')
.then(() => console.log("MongoDb connected"))
.catch((err) => console.log("Mongodb error: ", err));


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true, 
  }));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// route pathways
app.use("/",staticRouter);
app.use("/user", userRouter);
app.use('/expense',expenseRouter);


app.listen(PORT, ()=> console.log("Server listening on port: ", PORT));