const jwt = require('jsonwebtoken');


const authorize = (req, res, next) => {
    if ((typeof req.headers.authorization) == 'undefined') {
        return res.status(403).json({
            status: 'error',
            message: 'jwt undefined'
        })
    }
    else {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_SECRET, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(401).json({
                    status: 'error',
                    message: 'jwt malformed / expired'
                })
            }
            req.user = result;
            console.log(`${result.username} : Authorized`);
            next();
        })
    }
}

module.exports = authorize; 