const jwt = require("jsonwebtoken")


module.exports = (req,res,next) => {
    const authHeader = req.headers["authorization"];

    if(!authHeader){
        return res.status(400).send({
            auth : false , 
            message : "No se proveyó un Token"})
    }

    const token = authHeader.split(" ")[1];

    if(!token){
        return res.status(403).send({
            auth: false,
            message: "Token no valido"
        })
    }

    jwt.verify(token,process.env.SECRET_KEY,(error,decoded) => {
        if (error){
            return res.status(500).send({
                auth : false,
                message : "Error al autentificar el token"
            })
        }
        req.user_id= decoded.user_id
        next()
    })
}