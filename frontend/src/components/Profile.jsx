import { useEffect, useState } from 'react';
import { getUser } from '../apiCalls/user';


function Profile() {

  const [data, setData] = useState({})

    async function handleProfile() {
        const response = await getUser();
        console.log(response.data.user, "Profile Response");
        setData(response.data.user);
      }

  useEffect(() => {
    handleProfile();
  }, []);
  

  return (
        <div className="h-screen flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center pb-10">
                <img className="w-24 h-24 mb-3 rounded-full shadow-lg" src="https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg" alt="Bonnie image"/>
                <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{data.name}</h5>
                <span className="text-sm text-gray-500 dark:text-gray-400">{data.email}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{data.age} years old</span>
                <div className="flex mt-4 space-x-3 md:mt-6">
                    <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Profile</a>
                    <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">Change Password</a>
                </div>
            </div>
        </div>
  );
}

export default Profile;
