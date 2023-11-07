const jwt = require('jsonwebtoken')
const userModel = require('../models/User.js')

const generateAccessToken = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, { // id+secretKey => 1102abc
        expiresIn: "24h",
    });
    return token;
};

const generateRefreshToken = (id) => {
    const token = jwt.sign({ id: id }, process.env.JWT_SECRET_KEY, { // id+secretKey => 1102abc
        expiresIn: "1y",
    });
    return token;
};

const authentication = async (req, res, next) => {
    const beazerToken = req.headers.authorization;

    const token = beazerToken.split(" ")[1];

    // console.log(token)

    try {
        const checkToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const userId = checkToken.id;

        const user = await userModel.findById(userId);
        if(!user) {
            return res.status(401).json("Bạn chưa đăng nhập");
        }

        req.userId = userId;
        req.user = user;
        next()

    } catch (error) {
        console.log(error)
    }
};

module.exports = {
    authentication,
    generateAccessToken,
    generateRefreshToken
};