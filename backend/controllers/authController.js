const { prisma } = require("../config/db")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const db = require("mongodb")

dotenv.config()

exports.adminRegister = async (req,res) =>{
    const {name,email,password} = req.body;
    const hashPassword = await bcrypt.hash(password,10);
    try {
        const UserData = await prisma.user.create({
            data:{
                name,
                email,
                role: 'ADMIN',
                password:hashPassword
            }
        });
        res.status(201).send({message:"Created Admin",status:true,UserData})
    } catch (error) {
        console.log("Admin Register Error:",error.message);
        res.status(500).send({message:error.message,status:false})
    }

}

exports.adminLogin = async (req,res) =>{
    const {email,password} = req.body;
    try{
      const validUser = await prisma.user.findFirst({where:{email:email,role:'ADMIN'}});
      if(!validUser)return res.status(400).send({message:`User Doesn't exist`});
      const validPass =await bcrypt.compare(password,validUser.password);
      if(!validPass)return  res.status(400).send({message:`Wrong Password`});
      //we will generate token here and send it as response
      const token = jwt.sign(
        {id:validUser.id,email:email,role:'ADMIN'},
        process.env.JWT_SECRET_TOKEN,
        {expiresIn:'6h'});
      res.status(200).send({message:`Admin Login Successfull:`,token:token});
    }catch(err){ 
        res.status(400).send({message:err.message});

    }

}

// Additional admin controller functions would go here (viewUsers, viewClubs, createClub, etc.)