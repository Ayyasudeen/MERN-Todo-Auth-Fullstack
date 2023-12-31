
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../apiCalls/user';
import { userStore } from '../store';
import { shallow } from 'zustand/shallow';
import toast from 'react-hot-toast';

function Login() {
  const { updateName } = userStore(
    (state) => ({ updateName: state.updateName }),
    shallow
  );
const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  async function handleLogin() {
    const toastId = toast.loading('Loading...');
    const response = await login(formData);
    console.log(response, "Login Response");
    if (response.status === 200) {
        toast.dismiss(toastId);
        toast.success('Successfully Logged In!')
        updateName(response.data.user.name);
        navigate("/")
      } else if (response.response.status === 404) {
        toast.dismiss(toastId);
        updateName(null);
        toast.error(response.response.data.msg)
      } else if (response.response.status === 400) {
        toast.dismiss(toastId);
        updateName(null);
        if (response.response.data.msg === "Not Verified") {
          toast.error("Account Verification Pending - Check your registered mail for the verification link", {
            duration: 9000,
          });
        }
      } else {
        toast.dismiss(toastId);
        updateName(null);
        toast.error('Error Occurred!')
      }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
<section className="bg-gray-50 dark:bg-gray-900 h-full">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0"> 
      <div className="w-full bg-white rounded-lg shadow dark:border mt-[4%] md:mt-[4%] sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Login to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required />
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                  </div>
                  {/* <div className="flex items-center justify-between">
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                          </div>
                      </div>
                      <a href="#" className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">Forgot password?</a>
                  </div> */}
                  <button type="submit" className="w-full text-white bg-black hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
);}

export default Login;

