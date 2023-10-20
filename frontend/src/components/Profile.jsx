import { useEffect, useState } from 'react';
import { deleteUser, getUser, updateDetails, updatePassword } from '../apiCalls/user';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { userStore } from '../store';
import { shallow } from 'zustand/shallow';


function Profile() {
  const navigate = useNavigate();
  const {updateName } = userStore(
    (state) => ({updateName: state.updateName }),
    shallow
  );
  const [data, setData] = useState({})
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [profilePicId, setProfilePicId] = useState("");
  const [formData, setFormData] = useState({
    password: '',
    newPassword: ''
  });
  const [formData1, setFormData1] = useState({
    name: '',
    email: '',
    age: '',
    my_file: null,
  });
  const handleSelectFile = (e) => {
    const selFile = e.target.files[0];
    setFormData1({
      ...formData1,
      my_file: selFile,
    });
  } 

  async function handleProfile() {
      const response = await getUser();
      console.log(response.data.user, "Profile Response");
      setData(response.data.user);
      setProfilePicId(response.data.user.profilepicId);
      setFormData1({
        name: response.data.user.name,
        email: response.data.user.email,
        age: response.data.user.age,
    });
  }

  useEffect(() => {
    handleProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
        ...formData,
        [name]: value,
    });
  };

  const handleInputChange1 = (e) => {
    const { name, value } = e.target;

    setFormData1({
        ...formData1,
        [name]: value,
    });
  };

  async function changePassword(formData) {
    const toastId = toast.loading('Loading...');
    const response = await updatePassword(formData);
    console.log(response, "update password Response");
    if (response.status === 200) {
      setShowPasswordModal(false);
      toast.dismiss(toastId);
      toast.success("Password Changed Successfully");
    } else {
      toast.dismiss(toastId);
      toast.error("Error Occurred");

    }
  }

  async function changeDetails(formData1) {
    const updateFormData = new FormData();
    updateFormData.append('name', formData1.name);
    updateFormData.append('email', formData1.email);
    updateFormData.append('age', formData1.age);
    updateFormData.append('prevImgId', profilePicId);
    updateFormData.append('my_file', formData1.my_file);
    const toastId = toast.loading('Loading...');
    const response = await updateDetails(updateFormData);
    console.log(response, "update details Response");
    if (response.status === 200) {
      toast.dismiss(toastId);
      toast.success("Details Updated Successfully");
      handleProfile();
      setShowDetailsModal(false);
    } else {
      toast.dismiss(toastId);
      toast.error("Error Occurred");
    }
  }

  async function deleteAccount(id) {
    const toastId = toast.loading('Loading...');
    console.log(profilePicId);
    const picId = profilePicId.split("/");
    const response = await deleteUser(picId[1]);
    if (response.status === 200) {
      toast.dismiss(toastId);
      toast.success("Account Deleted Successfully");
      toast.dismiss(id);
      updateName(null);
      navigate("/register");
    } else {
      toast.dismiss(id);
      toast.dismiss(toastId);
      toast.error("Error Occurred");
    }
  }

   function handleDelete() {
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Are you sure you want to delete your account?
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Cannot recover once deleted
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-gray-200">
          <button
            onClick={() => deleteAccount(t.id)}
            className="w-full border border-transparent rounded-none py-0 px-3 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg py-0 px-3 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Close
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    })
  }

  function handleSubmit(e) {
    e.preventDefault();
    changePassword(formData);
  }

  function handleSubmit1(e) {
    e.preventDefault();
    changeDetails(formData1);
  }
  

  return (
        <>
        {(!showPasswordModal && !showDetailsModal) &&
          <div className="flex items-center w-80 mx-auto mt-[4%] justify-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="flex flex-col items-center pb-5">
                  <img className="w-24 h-24 mb-3 rounded-full shadow-lg mt-3" src={`${data.profilepic ? data.profilepic : "https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"}`} alt="Profile image"/>
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{data.name}</h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{data.email}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{data.age} years old</span>
                  <div className="mt-4 space-x-3 md:mt-6">
                      <div className='mt-4 space-x-3 md:mt-6'>
                      <button onClick={()=> setShowDetailsModal(true)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Profile</button>
                      <button onClick={()=> setShowPasswordModal(true)} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700">Change Password</button>
                      </div>
                      <div className='mt-2 text-center'>
                        <button onClick={()=> handleDelete()} className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-700 border border-red-300 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-200 dark:bg-red-800 dark:text-white dark:border-red-600 dark:hover:bg-red-700 dark:hover:border-red-700 dark:focus:ring-red-700">Delete Account</button>
                      </div>
                  </div>
              </div>
          </div>
        } 
        {showPasswordModal && 
              <div className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="relative w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <button onClick={() => setShowPasswordModal(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span className="sr-only">Close modal</span>
                      </button>
                      <div className="px-6 py-6 lg:px-8">
                          <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Change Password</h3>
                          <form className="space-y-6" onSubmit={handleSubmit}>
                              <div>
                                  <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old Password</label>
                                  <input type="password" name="password" id="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                              </div>
                              <div>
                                  <label htmlFor="newPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New Password</label>
                                  <input type="password" name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleInputChange} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                              </div>
                              <button type="submit" onClick={handleSubmit} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Password</button>
                          </form>
                      </div>
                  </div>
              </div>
              </div> 
        }
        {showDetailsModal && 
              <div className="fixed flex items-center justify-center top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
              <div className="relative w-full max-w-md max-h-full">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                      <button onClick={() => setShowDetailsModal(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                          </svg>
                          <span className="sr-only">Close modal</span>
                      </button>
                      <div className="px-6 py-6 lg:px-8">
                          <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Update Details</h3>
                          <form className="space-y-6" onSubmit={handleSubmit1}>
                              <div>
                                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                  <input onChange={handleInputChange1} value={formData1.name} type="text" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Name" required />
                              </div>
                              <div>
                                  <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Age</label>
                                  <input onChange={handleInputChange1} value={formData1.age} type="text" name="age" id="age" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Age" required />
                              </div>
                              <div>
                                  <label htmlFor="profilePic" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Profile Pic</label>
                                  <input multiple={false} onChange={handleSelectFile} type="file" name="profilePic" id="profilePic" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" placeholder="Select Image" />
                              </div>
                              <button type="submit" onClick={handleSubmit1} className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Update Details</button>
                          </form>
                      </div>
                  </div>
              </div>
              </div> 
        }
        </>
  );
}

export default Profile;
