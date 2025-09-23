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
        res.status(201).send({message:"Created Admin",status:true,user_data: {name, email}})
    } catch (error) {
        if(error.code == "P2002"){
            return res.status(409).send({message:"Email Already Exists",status:false})
        }
        console.log("Admin Register Error:",error);
        res.status(500).send({message:error.message, status:false})
    }

}

exports.adminLogin = async (req,res) =>{
    const {email,password} = req.body;
    try{
      const validUser = await prisma.user.findFirst({where:{email:email,role:'ADMIN'}});
      if(!validUser)return res.status(400).send({message:`User Doesn't exist`});
      const validPass =await bcrypt.compare(password,validUser.password);
      if(!validPass)return  res.status(400).send({message:`Wrong Password`});
      const token = jwt.sign(
        {id:validUser.id,email:email,role:'ADMIN'},
        process.env.JWT_SECRET_TOKEN,
        {expiresIn:'6h'});
      res.status(200).send({message:`Admin Login Successfull:`,token:token, user_data: {name: validUser.name, email: validUser.email, role:validUser.role}});
    }catch(err){ 
        res.status(400).send({message:err.message});
    }

}

exports.clubRegister = async (req,res) =>{
    const {name,email,description} = req.body;
    try {
        const user = await prisma.user.findUnique({where:{email:email}});
        if(!user){
            return res.status(404).send({status:false,message:"User Doesn't Exist, You need to have an account to Create a Club."})
        }
        const club_data = await prisma.club.create({
            data:{
                name,
                description,
                createdById: user.id
            }
        })
        res.status(201).send({message:"Club Created Successfully",status:true,club_data:{name,description,createdBy:user.name}})
    } catch (error) {
        if(error.code=="P2002"){
            return res.status(409).send({message:"Email Already Exists", status: false});
        }
        return res.status(500).send({message:error.message,status:false})
    }
}

