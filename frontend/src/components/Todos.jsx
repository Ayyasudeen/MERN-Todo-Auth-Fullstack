
import { useEffect, useState } from 'react';
import { createTodo, deleteTodo, getTodos, updateTodo } from '../apiCalls/todo';
import toast from 'react-hot-toast';
import { motion } from "framer-motion"

function Todos() {
    const [data, setData] = useState([]);
    const [showTodoModal, setShowTodoModal] = useState(false);
    const [editTodo, setEditTodo] = useState(0);
    const [todoId, setTodoId] = useState("");
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        completed: false
    });


    async function handleTodos() {
        const response = await getTodos();
        console.log(response.data.todos, "Todos Response");
        setData(response.data.todos);
    }

    async function handleDelete(id) {
        const toastId = toast.loading('Loading...');
        const response = await deleteTodo(id);
        if (response.status === 200) {
            handleTodos();
            toast.dismiss(toastId);
            toast.error('Todo Deleted Successfully!')
        } else {
            toast.dismiss(toastId);
            toast.error('Error Occurred!')
        }
    }

    useEffect(() => {
        handleTodos();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === "checkbox" ? (e.target.checked === true ? true : false) : value;
    
        setFormData({
            ...formData,
            [name]: newValue,
        });
    };

    function handleAdd() {
        setFormData({
            title: '',
            description: '',
            completed: false
        })
        setShowTodoModal(true);
        setEditTodo(0);
    }

    async function addTodo() {
        const toastId = toast.loading('Loading...');
        const response = await createTodo(formData);
        console.log(response, "Create Todo Response");
        if (response.status === 201) {
            handleTodos();
            toast.dismiss(toastId);
            toast.success('New Todo Added!')
            setShowTodoModal(false);
        } else {
            toast.dismiss(toastId);
            toast.error('Error Occurred!')
        }
    }

    const handleEdit = async (item) => {
    setEditTodo(1);
    setTodoId(item._id)
    setShowTodoModal(true);
    console.log(item, "Edit Item")
    setFormData({
        title: item.title,
        description: item.description,
        completed: item.completed
    });
    }

    async function updateTodoSubmit() {
        const toastId = toast.loading('Loading...');
        const response = await updateTodo(todoId, formData);
        console.log(response, "Update Todo Response");
        if (response.status === 200) {
            await handleTodos();
            setShowTodoModal(false);
            toast.dismiss(toastId);
            toast.success('Todo Updated!')
        } else {
            toast.dismiss(toastId);
            toast.error('Error Occurred!')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        editTodo === 1 ? updateTodoSubmit() : addTodo();
    };

    return (
        <>
            {!showTodoModal && 
                <div className="w-full mx-auto mt-[4%] max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Todos</h5>
                        <button onClick={() => {handleAdd()}} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                            Add Todo
                        </button>
                    </div>
                    <div className="flow-root">
                        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                            {data.map((item) => (
                                <motion.li whileHover={{ scale: 1.1 }} className="py-3 sm:py-4" key={item._id}>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            {item.completed ?
                                                <svg className="flex-shrink-0 w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                </svg> :
                                                <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                                </svg>
                                            }
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                                                {item.title}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                                                {item.description}
                                            </p>
                                        </div>
                                        <div className="inline-flex items-center text-base font-semibold text-gray-500 dark:text-white">
                                            <button type="button" onClick={()=> {handleEdit(item)}} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                    <path d="M12.687 14.408a3.01 3.01 0 0 1-1.533.821l-3.566.713a3 3 0 0 1-3.53-3.53l.713-3.566a3.01 3.01 0 0 1 .821-1.533L10.905 2H2.167A2.169 2.169 0 0 0 0 4.167v11.666A2.169 2.169 0 0 0 2.167 18h11.666A2.169 2.169 0 0 0 16 15.833V11.1l-3.313 3.308Zm5.53-9.065.546-.546a2.518 2.518 0 0 0 0-3.56 2.576 2.576 0 0 0-3.559 0l-.547.547 3.56 3.56Z" />
                                                    <path d="M13.243 3.2 7.359 9.081a.5.5 0 0 0-.136.256L6.51 12.9a.5.5 0 0 0 .59.59l3.566-.713a.5.5 0 0 0 .255-.136L16.8 6.757 13.243 3.2Z" />
                                                </svg>
                                                <span className="sr-only">Edit button</span>
                                            </button>
                                            <button type="button" onClick={()=> {handleDelete(item._id)}} className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-1.5 text-center inline-flex items-center mr-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">
                                                <svg className="w-3 h-3 text-white-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 20">
                                                    <path d="M17 4h-4V2a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v2H1a1 1 0 0 0 0 2h1v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6h1a1 1 0 1 0 0-2ZM7 2h4v2H7V2Zm1 14a1 1 0 1 1-2 0V8a1 1 0 0 1 2 0v8Zm4 0a1 1 0 0 1-2 0V8a1 1 0 0 1 2 0v8Z" />
                                                </svg>
                                                <span className="sr-only">Delete button</span>
                                            </button>
                                        </div>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </div>
                </div>
            }
            {showTodoModal && 
                <div className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
                <div className="relative w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <button onClick={() => setShowTodoModal(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="px-6 py-6 lg:px-8">
                            <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">{editTodo === 1 ? "Update Todo" : "Add Todo"}</h3>
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
                                    <input onChange={handleInputChange} value={formData.title} type="text" name="title" id="title" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Title" required />
                                </div>
                                <div>
                                    <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Description</label>
                                    <input onChange={handleInputChange} value={formData.description} type="text" name="description" id="description" placeholder="description" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" required />
                                </div>
                                {
                                    editTodo === 1 && 
                                    <div className="flex justify-between">
                                        <div className="flex items-start">
                                            <div className="flex items-center h-5">
                                                <input id="completed" checked={formData.completed === true ? true : false} onChange={handleInputChange} name="completed" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" />
                                            </div>
                                            <label htmlFor="completed" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Mark as completed</label>
                                        </div>
                                    </div>
                                }
                                <button type="submit" onClick={handleSubmit} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">{editTodo === 1 ? "Update Todo" : "Add Todo"}</button>
                            </form>
                        </div>
                    </div>
                </div>
                </div> 
            }
            
        </>
    )
}

export default Todos;

