// userService.js
import Users from '../daos/dbManager/user.dao.js'; 

const userDao = new Users();

export const userService = {
    getAll: async () => {
        return await userDao.getAll();
    },

    getUserById: async (id) => {
        return await userDao.getUserById(id);
    },

    save: async (user) => {
        return await userDao.save(user);
    },

    update: async (id, user) => {
        return await userDao.update(id, user);
    },

    delete: async (id) => {
        return await userDao.delete(id);
    },
};
