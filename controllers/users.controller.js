const db = require("../db/db");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
require("dotenv").config()




//Registar un usuario 
const registerUser = (req, res) => {
    const { user_email, user_password } = req.body;

    // Verificar que los campos no sean null
    if (!user_email || !user_password) {
        return res.status(400).json({
            message: "Todos los campos son requeridos"
        });
    }

    // Chequear si el email existe 
    const emailExists = "SELECT * FROM users WHERE user_email = ?";

    db.query(emailExists, [user_email], async (error, results) => {
        if (error) {
            return res.status(500).json({
                message: "No se pudo registrar el usuario"
            });
        }

        if (results.length > 0) {
            return res.status(400).json({
                message: "El email ya se encuentra registrado"
            });
        }
        //Hashear la contraseña
        const passwordHash = await bcrypt.hash(user_password, 8);
        

        // Registrar el usuario 
        const user = "INSERT INTO users (user_email, user_password) VALUES (?, ?)";

        db.query(user, [user_email, passwordHash], (err, results) => {
            if (err) {
                return res.status(400).json({
                    message: "Error al registrar al usuario"
                });
            }
            // Obtener el user_id del resultado de la inserción
            const userId = results.insertId;
            //Firmar el token
            const token = jwt.sign({ user_id: userId }, process.env.SECRET_KEY, { expiresIn: "1h" });

            return res.status(201).json({
                message: "Usuario registrado exitosamente",
                token: token
            });
        });
    });
};

//Logear un usuario
const logInUser = (req, res) => {
    const { user_email, user_password } = req.body
    const userQuery = "SELECT * FROM users WHERE user_email = ?"

    db.query(userQuery, [user_email], (error, result) => {
        if (error) {
            return res.status(500).json({
                message: " Ocurrio un error"
            })
        }
        if (result.length == 0) {
            return res.status(400).json({
                message: "No se encuentra el email"
            })
        }
        const user = result[0];
        //Compara la contraseña cifrada
        const validPassword = bcrypt.compareSync(user_password,user.user_password)

        if(!validPassword){
            return res.status(400).json({
                message : "Contraseña incorrecta",
                token : null,
                auth : false
            })
        }else {
            const token = jwt.sign({ user_id: user.user_id},process.env.SECRET_KEY,{expiresIn : "1h"})

            return res.status(200).json({
                message : "Usuario logeado exitosamente",
                token : token,
                auth : true
            })
        }
    })
}

//Obtener todos los usuarios
const getAllUsers = (req, res) => {
    const allUsers = "SELECT * FROM users "
    db.query(allUsers, (error, rows) => {
        if (error) {
            return res.status(500).json({
                message: "No se pudo completar la solicitud"
            });
        }
        res.json(rows);
    })
}

//Obtener un usuario 
const getUser = (req, res) => {
    const { id } = req.params
    const userQuery = "SELECT * FROM users WHERE user_id = ?"

    db.query(userQuery, [id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: "No se pudo obtener el usuario"
            })
        }

        if (results.length == 0) {
            return res.status(400).json({
                message: "No se encontro al usuario"
            })
        }
        res.json(results)
    })
}

//Borrar un usuario
const deleteUser = (req, res) => {
    const { id } = req.params;
    const userQuery = "DELETE FROM users WHERE user_id = ?"

    db.query(userQuery, [id], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: "No se pudo borrar el usuario"
            })
        }

        if (results.affectedRows == 0) {
            return res.status(400).json({
                message: "El usuario no se encuentra"
            })
        }
        return res.status(200).json({
            message: "Usuario eliminado exitosamente"
        })
    })
}

//Actualizar un usuario
const updateUser = (req, res) => {
    const { user_email, user_password } = req.body
    const userQuery = "SELECT * FROM users WHERE user_email = ?"

    db.query(userQuery, [user_email], (error, results) => {
        if (error) {
            return res.status(500).json({
                message: "No se pudo actualizar el usuario"
            })
        }

        if (results.length == 0) {
            return res.status(400).json({
                message: "No se encontro al usuario"
            })
        }
        const updateQuery = "UPDATE users SET user_password = ? WHERE user_email = ?"
        db.query(updateQuery, [user_password, user_email], (error, results) => {
            if (error) {
                return res.status(400).json({
                    message: "Error al actualizar la contraseña"
                })
            }
            return res.status(200).json({
                message: "Contraseña actualizada"
            })
        })
    })
}

const protected = (req,res) => {
   return  res.status(200).send(`Hola usuario ${req.user_id}`);
}

module.exports = {
    registerUser,
    logInUser,
    getAllUsers,
    deleteUser,
    getUser,
    updateUser,
    protected
};
