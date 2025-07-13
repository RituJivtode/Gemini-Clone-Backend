const jwt = require('jsonwebtoken');

exports.generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.verifyToken = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if(!token){
            return res.status(400).send({status:false, message: "Token is required..!"});
        }
        const tokenValue = token.split(' ')[1];
        
        jwt.verify(tokenValue, process.env.JWT_SECRET, function(err, decoded) {
            if (err)
            return res.status(400).send({ status: false, message: "invalid token "}); 
            console.log(decoded)

        let userLoggedIn = decoded.id; 
        req["userId"] = userLoggedIn; 
     
        next(); 
     })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  
};
