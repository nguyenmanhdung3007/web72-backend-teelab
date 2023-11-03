const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

const Users = require('../models/User.js');
const Joi = require('joi');

const login = async (req, res) => {
    const { password, email } = req.body;

    const emailExist = await Users.findOne({ email })
    console.log(emailExist)

    if (!emailExist) {
        return res.status(400).json("Người dùng không tồn tại");
    }

    const checkPassword = bcrypt.compareSync(password, emailExist.password)
    if (!checkPassword) {
        return res.status(400).json("Sai mật khẩu");
    }

    const token = jwt.sign({
        id: emailExist.id
    }
        , process.env.JWT_SECRET_KEY,
        {
            expiresIn: "30m"
        }
    )

    return res.status(201).json({
        email: email,
        token: token
    })
}

const register = async (req, res) => {

    try {
        const body = req.body;

        const Schema = Joi.object({
            email: Joi.string()
                .email({
                    minDomainSegments: 2,
                    tlds: { allow: ["com", "net"] }
                })
                .required()
            , username: Joi.string()
                .required()
            , password: Joi.string()
                .regex(
                    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/ // Mindx123@
                )
            , phone: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
            .required()
            , shippingAddress: {
                address: Joi.string(),
            },
            birth_year: Joi.number()
                .integer()
                .min(1900)
                .max(2013)
            ,
            shippingAddress: {
                address: Joi.string()
                    .required(),
                district: Joi.string()
                    .required(),
                city: Joi.string()
                    .required(),
            }

        }).unknown(true)


        const { error } = Schema.validate(body)
        if (error) {
            res.status(400);
            console.log(error.message)
            throw new Error("Email hoặc mật khẩu không hợp lệ.")
        }

        const sath = await bcrypt.genSalt(10);
        const newPass = await bcrypt.hash(body.password, sath)

        body.password = newPass;

        const { email } = body;

        const EmailExist = await Users.findOne({ email });
        if (EmailExist) {
            return res.status(400).json("Email đã tồn tại!")
        }

        const newUser = await Users.create(body);

        return res.status(201).send("Thêm mới thành công User: \n" + newUser)
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAllUser = async (req, res) => {
    const users = await Users.find({});
    return res.status(200).json({ user: users });
};

module.exports = {
    login,
    register,
    getAllUser
}