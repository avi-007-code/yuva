const { prisma } = require("../config/db")


exports.viewUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({ where: { id: id } });
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        res.status(200).send({ status: true, message: `View user with ID ${id}` });
    } catch (error) {
        res.status(400).send({ status: false, message: error.message });
    }
};

exports.viewAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            // select:{
            //     id:true,
            //     name:true,
            //     email:true,role:true
            // }
        });
        res.status(200).send({  status: true,message: 'Fetched all users', data: users });
    } catch (error) {
        res.status(500).send({ status: false , message: error.message});
    }
};

exports.viewClub = async (req, res) => {
    const { id } = req.params;
    try {
        const club = await prisma.club.findUnique({ where: { id: id } });
        if (!club) {
            return res.status(404).send({ error: 'Club not found' });
        }
        res.status(200).send({ status:true, message: `View club with ID ${id}`, data: club });
    } catch (error) {
        res.status(400).send({ status: false , message: error.message });
    }
};

exports.viewAllClubs = async (req, res) => {
    try {
        const clubs = await prisma.club.findMany();
        res.status(200).send({ status: true, message: 'Fetched all clubs', data: clubs });
    } catch (error) {
        res.status(400).send({ status: false  , message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.delete({ where: { id: id } });
        res.status(200).send({status: true, message: `Deleted user with ID ${id}`, data: user });
    } catch (error) {
        res.status(400).send({ status: false  , message: error.message });
    }
};

exports.deleteClub = async (req, res) => {
    const { id } = req.params;
    try {
        const club = await prisma.club.delete({ where: { id: id } });
        res.status(200).send({status: true, message: `Deleted club with ID ${id}`, data: club });
    } catch (error) {
        res.status(400).send({ status: false , message: error.message });
    }
};

