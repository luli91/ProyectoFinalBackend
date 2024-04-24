import { userService } from '../services/user.services.js'; 

export const getAllUsers = async (req, res) => {
    const users = await userService.getAll();
    res.send({ status: "success", payload: users });
}

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
    saveUser
}
