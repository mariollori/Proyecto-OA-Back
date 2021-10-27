const jwt = require('jsonwebtoken');
const secret = "ex4m3n-p4r614l-3";
const refreshTokenSecret = "ex4m3n-p4r614l-3-refresh-access-token";
module.exports = {
    checkToken: (req, res, next) => {
        const tokenaccess = req.header('authorization');
        console.log(tokenaccess)
        if (typeof tokenaccess !== 'undefined') {
           
         
            const token = tokenaccess;
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    res.status(401).json({
                        success: 0,
                        message: "token invalido"
                    });
                } else {
                    console.log(req.body)
                    next();
                }
            });
        } else {
            res.status(401).json({
                success: 0,
                message: "Acceso denegado no arutorizado "
            });
        }
    }
}