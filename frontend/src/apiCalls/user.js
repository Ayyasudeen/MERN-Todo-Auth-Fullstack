import axios from 'axios';



export const register = async (user) => {
    try {
        const res = await axios.post("/api/users/register", user);
        return res;
    } catch (error) {
        return error;
    }
}

export const login = async (user) => {
    try {
        const res = await axios.post("/api/users/login", user);
        return res;
    } catch (error) {
        return error;
    }
}

export const logout = async () => {
    try {
        const res = await axios.get("/api/users/logout");
        return res;
    } catch (error) {
        return error;
    }
}

export const getUser = async () => {
    try {
        const res = await axios.get("/api/users/me");
        return res;
    } catch (error) {
        return error;
    }
}

export const updateDetails = async (user) => {
    try {
        const res = await axios.put("/api/users/updateDetails", user);
        return res;
    } catch (error) {
        return error;
    }
}

export const updatePassword = async (password) => {
    try {
        const res = await axios.put("/api/users/updatepassword", password);
        return res;
    } catch (error) {
        return error;
    }
}

export const deleteUser = async () => {
    try {
        const res = await axios.delete("/api/users/delete");
        return res;
    } catch (error) {
        return error;
    }
}