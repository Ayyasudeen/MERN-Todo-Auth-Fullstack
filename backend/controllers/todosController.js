import Todo from "../models/Todo.js";

export const getTodo = async (req, res) => {
    try {
        const todos = await Todo.find({user: req.user});
        res.status(200).json({msg: "Todo Found", todos})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({errors: "Internal Server Error"});
    }
};

export const getTodos = async (req, res) => {};

export const createTodo = async (req, res) => {};

export const updateTodo = async (req, res) => {};

export const deleteTodo = async (req, res) => {};