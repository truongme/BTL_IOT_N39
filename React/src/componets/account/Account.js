import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import './Account.css'

const Account = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadAccount();
  },[]);

  const loadAccount= async () => {
    const result = await axios.get(`http://localhost:8080/account`);
    setUsers(result.data);
  }

  const filteredUsers = users.filter((users) =>
    users.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (id) => {
    if (window.confirm("Bạn chắc chắn muốn xóa người dùng này không?")) {
      axios.delete(`http://localhost:8080/account/${id}`)
        .then((response) => {
          if (response.status === 200) {
            setUsers(users.filter((user) => user.id !== id));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="ctn">
      <div className='account_ctn'>
        <p className='h1_acc'>Quản lí tài khoản</p>
        <div className="search">
          <label>Tìm kiếm người dùng</label>
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <table>
          <thead>
            <tr >
              <th>Id</th>
              <th>Username</th>
              <th>Role</th>
              <th>Chức năng</th>
            </tr>
          </thead>
            <tbody>
              {filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.role}</td>
                      <td className="button_ctn_acc">
                      {user.role !== 'admin' ? (
                        <div>
                          <button onClick={() => { navigate(`/account/${user.id}`)}}>Sửa người dùng</button>
                          <button onClick={() => confirmDelete(user.id)}>Xóa người dùng</button>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                ))
              }
            </tbody>
        </table>
      </div>
      <button className="button_success" onClick={() => { navigate(`/account/${-1}`) }}>Thêm người dùng</button>
    </div>
  )
}

export default Account