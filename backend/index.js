const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser") ;

dotenv.config(); 

const app = express();

const {connectDB,prisma} =require('./config/db');
connectDB();

const adminRouter = require('./routes/adminRoutes');
const clubRouter =require('./routes/clubRoutes');
// const memberRouter = require('./routes/memberRoutes')



app.use(express.json());  // Middleware to parse JSON request bodies

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173"
}))

app.get('/',(req,res)=>{
    res.status(200).send({message:"API Working..."})
})

app.use('/api/admin',adminRouter)
// app.use('/api/member',memberRouter)
app.use('/api/club',clubRouter)

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Running at http://localhost:${PORT}`);
})