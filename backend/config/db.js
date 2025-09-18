const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("Database Connected...");
    }   catch (error) {     
        console.error("Database Connection Failed:", error);
        process.exit(1); 
    }
};

module.exports = { connectDB, prisma };