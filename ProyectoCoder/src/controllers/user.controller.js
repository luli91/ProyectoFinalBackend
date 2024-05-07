import { userService } from '../services/user.services.js'; 
import userModel from '../models/user.model.js';
import { sendEmail } from './email.controller.js';


export const getAllUsers = async () => {
    try {
        // console.log('Entrando a la función getAllUsers');
        const users = await userService.getAll();
        // console.log('Usuarios obtenidos:', users);
        return users;
    } catch (error) {
        console.error('Error al obtener los usuarios:', error);
        throw error;
    }
}
// con el res send puedo hacer la prueba en postman

export const getUser = async (req, res) => {
    const userId = req.params.uid;
    const user = await userService.getUserById(userId);
    res.send({ status: "success", payload: user });
}

export const updateUser = async (req, res) => {
    const { first_name, last_name, age, email, role } = req.body;
    const userId = req.params.uid;
    const userDto = {
        first_name,
        last_name,
        age,
        email,
        role
    }
    const user = await userService.update(userId, userDto);
    res.status(200).send({ status: "success", payload: user });
}

export const deleteUser = async (req, res) => {
    const userId = req.params.uid;
    const result = await userService.delete(userId);
    res.send({ status: "success", message: "User deleted" });
}

export const deleteInactiveUsers = async (req, res) => {
    try {
        // Obténgo la fecha y hora de hace 2 días
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

// Busca los usuarios que no hayan tenido conexión en los últimos 2 días
        const inactiveUsers = await userModel.find({ lastConnection: { $lt: twoDaysAgo } });


        // console.log("Usuarios inactivos:", inactiveUsers);

        // Para cada usuario inactivo...
        for (const user of inactiveUsers) {
            // console.log(`Correo electrónico del usuario: ${user.email}`);
            // console.log(`Nombre del usuario: ${user.first_name}`);
            if (!user.email) {
                console.error(`No se definió el correo electrónico para el usuario ${user._id}`);
                continue;
            }

            // Envía el correo
            await sendEmail(user.email, "Tu cuenta ha sido eliminada", `<div><h1> Hola ${user.first_name}, </h1><p> Tu cuenta ha sido eliminada debido a inactividad. </p></div>`);


            // Elimina el usuario de la base de datos
            const deleteResult = await userModel.deleteOne({ _id: user._id });
            // console.log(`Resultado de la eliminación del usuario ${user._id}:`, deleteResult);
        }

        // Envía una respuesta
        res.send({ message: "Usuarios inactivos eliminados" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error, message: "No se pudo eliminar a los usuarios inactivos." });
    }
}

export const saveUser = async (req, res) => {
    const { first_name, last_name, age, email } = req.body;
    const userDto = {
        first_name,
        last_name,
        age,
        email
    }
    const user = await userService.save(userDto); // Usa el método save del servicio
    res.status(201).send({ status: "success", payload: user });
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteInactiveUsers,
    saveUser
}
