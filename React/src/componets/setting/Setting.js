import React, { useEffect, useState } from "react";
import axios from 'axios';
import './setting.css'

const Setting = () => {

  const id = 1;

  const [threshold, setThreshold] = useState({
    id: "",
    temp: "",
    hum: "",
    gas: "",
  });
    
  function handle(e) {
    const { id, value } = e.target;
    setThreshold(prevState => ({ ...prevState, [id]: value }));
  }

  const handleDismissAlert = async () => {
    try {
      await axios.post('http://localhost:8080/api/dismissAlert', {});
      alert("Tắt thông báo thành công!")
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const handleTurnOnAlert = async () => {
    try {
      await axios.post('http://localhost:8080/api/turnOnAlert', {});
      alert("Đã bật cảnh báo!")
    } catch (error) {
      console.error('Error sending message:', error.message);
    }
  };

  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const handleSetup = async (e) => {
    e.preventDefault();
    setIsInputDisabled(false);
    setIsUpdateMode(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (window.confirm("Bạn chắc chắn thay đổi không?")) {
      axios.put(`http://localhost:8080/api/updateThreshold/${id}`, threshold)
      .then((response) => {
        console.log(response.data);
        alert("Cập nhật ngưỡng cảnh báo thành công")
      })
      .catch((error) => {
        console.error(error);
      });
    }
    
    setIsInputDisabled(true);
    setIsUpdateMode(false);
  };

  useEffect(() => {
    axios.get(`http://localhost:8080/api/threshold/1`)
    .then((response) => setThreshold(response.data))
    .catch((err) => console.log(err))
  }, []);


  return (
    <div>
      <div>
        <p className='header_setting'>Cài đặt ngưỡng cảnh báo</p>
      </div>
      <form onSubmit={(e)=> submit(e)}>
        <div className='setting_ctn'>
          <div className='threshold_ctn'>
            <label className='title'>Nhiệt độ</label>
            <input disabled={isInputDisabled}  type="number" id="temp" value={threshold.temp ||""} onChange={(e) => handle(e)}/>
          </div>
          <div className='threshold_ctn'>
            <p className='title'>Độ ẩm</p>
            <input disabled={isInputDisabled} type="number" id="hum" value={threshold.hum ||""} onChange={(e) => handle(e)}/>
          </div>
          <div className='threshold_ctn'>
            <p className='title'>Khí Gas</p>
            <input disabled={isInputDisabled} type="number" id="gas" value={threshold.gas ||""} onChange={(e) => handle(e)}/>
          </div>
          {isUpdateMode ? (
            <button type="submit">CẬP NHẬT</button>
          ) : (
            <button type="button" onClick={(e) => handleSetup(e)}>CÀI ĐẶT</button>
          )}
        </div>
      </form>
      <div className='button_ctn'>
        <button onClick={() => handleTurnOnAlert()}>Bật thông báo</button>
        <button onClick={() => handleDismissAlert()}>Tắt Thông báo</button>
      </div>
    </div>
  )
}

export default Setting