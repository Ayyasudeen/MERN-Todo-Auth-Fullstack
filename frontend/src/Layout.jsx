import Login from './components/Login';
import Navbar from './components/Navbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { userStore } from './store';
import { shallow } from 'zustand/shallow';
import { useEffect } from 'react';
import Register from './components/Register';

const Layout = () => {
  const { name } = userStore(
    (state) => ({ name: state.name }),
    shallow
  );
  const navigate = useNavigate();
  useEffect(() => {
    window.location.pathname != "/register" &&
    name === null && navigate("/login")
  }, [window.location.pathname]);
  return (
    <>
        {
          name ? 
          <div className='h-screen overflow-hidden'><Navbar /><Outlet /></div>
          : window.location.pathname == "/register" ?
          <div className='h-screen overflow-hidden'><Navbar /><Register /></div>
          :
          <div className='h-screen overflow-hidden'><Navbar /><Login /></div>
        }
    </>
  )
}

export default Layout