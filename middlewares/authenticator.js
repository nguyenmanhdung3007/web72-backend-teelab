
const authentication = (req, res, next) => {
    const beazerToken = req.headers.authorization;

    const token = beazerToken.split(" ")[1];
    
    console.log(token)
};

module.exports = authentication;