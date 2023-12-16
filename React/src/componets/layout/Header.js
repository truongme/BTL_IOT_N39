import React from 'react'
import './Header.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faGear, faUser, faBell, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import { Link, useNavigate } from "react-router-dom";

const Header = () => {

  const navigate = useNavigate();
  const accessAdmin = localStorage.getItem("accessAdmin") === "true";

  return (
    <div className='container'>
        <div>
            <div className='logo'>
            Unity
            </div>
            <div className='ctn_list'>
                <ul>
                    <li  onClick={() => { navigate(`/home`)}}>
                        <div className='icon'>
                        <FontAwesomeIcon icon={faHouse} />
                        </div>
                        <p className=''>Trang chủ</p>
                    </li>
                    {
                        localStorage.getItem("accessAdmin") ? (
                            <li onClick={() => { navigate(`/account`)}}>
                                <div  className='icon'>
                                    <FontAwesomeIcon icon={faUser} />
                                </div>
                                <p>Tài khoản</p>
                            </li>
                        ) : (null)
                    }
                    {
                        localStorage.getItem("accessAdmin") ? (
                        <li  onClick={() => { navigate(`/setting`)}}>
                            <div  className='icon'>
                                <FontAwesomeIcon icon={faGear}/>
                            </div>
                            <p>Cài đặt</p>
                        </li>
                         ) : (null)
                    }
                </ul>
                <div>
                    
                </div>
            </div>
        </div>
        <div className='user' onClick={() => { navigate(`/`)}}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            <p>ĐĂNG XUẤT</p>
        </div>
    </div>
  )
}

export default Header