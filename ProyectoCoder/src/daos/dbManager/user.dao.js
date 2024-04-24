import userModel from "../../models/user.model.js";

export default class Users {
    
    getAll = () => {
        return userModel.find();
    }

    getUserById = (id) => {
        return userModel.findById(id);
    }

    save = (doc) => {
        return userModel.create(doc);
    }

    update = (id, doc) => {
        return userModel.findByIdAndUpdate(id, {$set: doc})
    }

    delete = (id) => {
        return userModel.findByIdAndDelete(id);
    }
}
