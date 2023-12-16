import React, { useEffect, useState } from "react";
import axios from 'axios';

import './Login.css';

function Login(props) {
  localStorage.removeItem("accessAdmin");
  localStorage.removeItem("accessUser");
  localStorage.removeItem('userId');

  const [user, setUser] = useState({
    id: "",
    username: "",
    password: "",
    role: "",
  });

  function handle(e) {
    const { id, value } = e.target;
    setUser(prevState => ({ ...prevState, [id]: value }));
  }

  const submit = async (e) => {
    e.preventDefault();

    if (!user.username || !user.password) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    axios.post(`http://localhost:8080/login`, user)
      .then((response) => {
        alert("Bạn đã đăng nhập thành công!");
        const data = response.data;
        const userRole = data.role;
        if (userRole === 'admin') {
          localStorage.setItem("accessAdmin", true)
        }
        else {
          localStorage.setItem("accessUser", true)
        }
        window.location.href = '/home';
      })
      .catch((error) => {
        console.error(error);
        alert("Sai tài khoản hoặc mật khẩu!");
      });

  }

  useEffect(() => {
    axios.get(`http://localhost:8080`)
      .then((response) => setUser(response.data))
      .catch((err) => console.log(err))
  }, []);

  return (
    <div className="login_ctn">
      <div className="login_form">
        <form className="login_form" onSubmit={(e) => submit(e)}>
          <h1 className="header_login">LOGIN</h1>
          <div>
            <label htmlFor="exampleInputusername1" >Username</label>
            <input
              type="username"
              className="form-control"
              id="username"
              value={user.username || ""}
              onChange={(e) => handle(e)}
            />
          </div>
          <div>
            <label htmlFor="exampleInputPassword1" >Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={user.password || ""}
              onChange={(e) => handle(e)}
            />
          </div>
          <button>Login</button>
        </form>
      </div>
    </div>
  );
  
}

export default Login;
