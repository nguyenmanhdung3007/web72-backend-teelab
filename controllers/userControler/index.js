const bcrypt = require("bcryptjs")

const Users = require('../../models/User.js');
const Joi = require('joi');
const { generateAccessToken, generateRefreshToken } = require("../../middlewares/authenticator.js");
const userModel = require("../../models/User.js")

const login = async (req, res) => {
    try {
        const { password, email } = req.body;

        const emailExist = await Users.findOne({ email })

        if (!emailExist) {
            return res.status(400).json("Người dùng không tồn tại");
        }

        const checkPassword = bcrypt.compareSync(password, emailExist.password)
        if (!checkPassword) {
            return res.status(400).json("Sai mật khẩu");
        }

        //create access token,refresh token
        const accessToken = generateAccessToken(emailExist._id)
        const refreshToken = generateRefreshToken(emailExist._id)

        console.log(accessToken)
        await Users.findByIdAndUpdate(emailExist._id, { refreshToken });
        
        return res.status(201).json({
            // email: email,
            accessToken: accessToken,
            refreshToken: refreshToken
        })
    } catch (error) {
        return res.status(400).json({ message: error.message})
    }
    
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
            , password: Joi.string()
                .regex(
                    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/ // Mindx123@
                )
                .required()
            , phone: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
            , 
            birth_year: Joi.number()
                .integer()
                .min(1900)
                .max(2013)
            ,
            shippingAddress: {
                address: Joi.string(),
                district: Joi.string(),
                city: Joi.string(),
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

        return res.status(201).json({ "Thêm mới thành công User: \n": newUser })
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const getAllUser = async (req, res) => {

    try {
        const pageSize = req.query.pageSize || 5
        const pageIndex = req.query.pageIndex || 1

        // console.log(pageSize, pageIndex)

        const users = await Users.find({}).skip(pageSize * pageIndex - pageSize).limit(pageSize);

        // console.log(users)
        return res.status(200).json({
            user: users,
            countUser: users.length
        });
    } catch (error) {
        return res.status(400).json({
            
        })
    }

    
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id)

        const body = req.body;
        const Schema = Joi.object({
            email: Joi.string()
                .email({
                    minDomainSegments: 2,
                    tlds: { allow: ["com", "net"] }
                })
            , username: Joi.string()
            , password: Joi.string()
                .regex(
                    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/ // Mindx123@
                )
            , phone: Joi.string().regex(/^[0-9]{10}$/).messages({ 'string.pattern.base': `Phone number must have 10 digits.` })
            , shippingAddress: {
                address: Joi.string(),
            },
            birth_year: Joi.number()
                .integer()
                .min(1900)
                .max(2013)
            ,
            shippingAddress: {
                address: Joi.string(),
                district: Joi.string(),
                city: Joi.string()
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

        const Result = await userModel.findByIdAndUpdate(id, body, { new: true });

        return res.status(201).json({
            message: " Cập nhật sản phẩm thành công",
            status: 'success',
            user: Result
        })
    } catch (error) {

    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const productDeleted = await userModel.findByIdAndDelete(id);

        if (productDeleted) {
            return res.status(200).json({
                message: "Xóa sản phẩm thành công",
                status: "success",
                productDeleted: productDeleted
            })
        } else {
            return res.status(200).json({
                message: "Sản phẩm đã được xóa trước đó",
                status: "falle",
                productDeleted: productDeleted
            })
        }
    } catch (error) {
        res.status(400)
        throw new Error(error);
    }
};

const refeshToken = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id)
        const userExits = await userModel.findById(id);
        const refreshToken = userExits.refreshToken;

        res.status(201).json({
            refreshToken: refreshToken,
            status: 'success',
            user: userExits
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
}

const logOut = async (req, res) => {
    try {
        const id = req.params.id;
        const userExits = await userModel.findById(id);

        const result = await userModel.findByIdAndUpdate(id, { ...userExits, refreshToken: '' });
        return res.status(201).json({
            user: result,
            status: "success"
        });
    } catch (error) {
        console.log(error.message)
        return res.status(400).json(error.message)
    }
};

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Users.findById(id);
        return res.status(200).json({
            user: result,
            status: 'success'
        })
    } catch (error) {

    }
}

module.exports = {
    login,
    register,
    getAllUser,
    updateUser,
    deleteUser,
    refeshToken,
    logOut,
    getUserById
}