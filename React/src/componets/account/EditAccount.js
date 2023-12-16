import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';

import './edit.css'

const EditAccount = () => {
    const params = useParams("");
    const id = params.id;
    
    function handle(e) {
        const { id, value } = e.target;
        setUser(prevState => ({ ...prevState, [id]: value }));
    }

    const [user, setUser] = useState({
        id: "",
        username: "",
        password: "",
        role: "",
    });


    const submit =async (e)=>{
        e.preventDefault();
        
        if (!user.username || !user.password || !user.role) {
            alert("Vui lòng nhập đầy đủ thông tin của sách");
            return;
        }

        
        if (id > 0) {
            if (window.confirm("Bạn chắc chắn thay đổi không?")) {
                axios.put(`http://localhost:8080/account/${id}`, user)
                .then((response) => {
                    console.log(response.data);
                    window.location.href = '/account';
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        }
        else{
            if (window.confirm("Bạn chắc chắn muốn thêm thành viên không?")) {
                axios.post(`http://localhost:8080/account/insert`, user)
                .then((response) => {
                    alert("Bạn thêm thành viên thanh công")
                    const newUserId = response.data; 
                    console.log(response.data);
                    window.location.href = '/account';
                })
                .catch((error) => {
                    alert("Username đã tồn tại!");
                    console.error(error);
                });
            }
        }
    }

    useEffect(() => {
        axios.get(`http://localhost:8080/account/${id}`)
        .then((response) => setUser(response.data))
        .catch((err) => console.log(err))
    }, []);


  return (
    <div className="edit_ctn">
        <h1>{id < 0 ? "Thêm thành viên" : `Người dùng số ${id}`}</h1>
        <form onSubmit={(e)=> submit(e)}>
            <div >
                <div>
                    <div className="col">
                        <label>Id</label>
                        <input disabled 
                        type="number"
                        id="id"
                        value={user.id ||""}
                        onChange={(e) => handle(e)
                            
                        }
                        />
                    </div>
                    <div className="col">
                        <label>Tên đăng nhập</label>
                        <input 
                        type="text"
                        id="username"
                        value={user.username || ""}
                        onChange={(e) => handle(e)}
                        />
                    </div>
                    <div className="col">
                        <label>Mật khẩu</label>
                        <input 
                        type="password"
                        id="password"
                        value={user.password ||""}
                        onChange={(e) => handle(e)}
                        />
                    </div>
                    <div className="col">
                        <select value={user.role || ""} onChange={(e) => handle(e)} id="role" className="select">
                            <option value="">-- Phân quyền --</option>
                            <option value="admin">admin</option>
                            <option value="user">user</option>
                        </select>
                    </div>
                </div>
            </div>    
            <button type="submit" className="button_success button_mar">
                Cập nhật
            </button>    
        </form>
    </div>
  )
}

export default EditAccount