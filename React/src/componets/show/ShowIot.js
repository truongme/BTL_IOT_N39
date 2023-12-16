import './ShowIot.css'
import srcimg from '../assets/bg.jpg'
import fire from '../assets/fire.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTemperatureThreeQuarters, faGasPump } from '@fortawesome/free-solid-svg-icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useShowIot } from './ShowIotContext';

const ShowIot = () => {
  const { showIotData } = useShowIot();

  return (
    <div className='container_show'>
      <div className='display_board'>
        <div className='img_ctn'>
          <img src={srcimg}></img>
        </div>
        <div className='show_ctn'>
          <div>
            <p>Nhiệt độ</p>
            <div className='data_ctn'>
              {showIotData.temp}
              <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
            </div>
          </div>
          <div>
            <p>Độ ẩm</p>
            <div className='data_ctn'>
              <p>{showIotData.hum}</p>
              <FontAwesomeIcon icon={faTemperatureThreeQuarters} />
            </div>
          </div>
          <div>
            <p>Khí Gas</p>
            <div className='data_ctn'>
              <p>{showIotData.gas}</p>
              <FontAwesomeIcon icon={faGasPump} />
            </div>
          </div>
        </div>
      </div>
      <div className='fire'>
        {showIotData.flame==='1' ? (
          <p className='fire_text'>Không phát hiện thấy lửa</p>
        ): showIotData.flame === '0' ? (
          <p className='fire_text'>Đã phát hiện thấy lửa</p>
        ):(
          <p className='fire_text'>Loading...</p>
        )}
        <div className='fire_ctn'>
          <img src={fire}></img>
        </div>
      </div>
      <div className='table_ctn'>
        <LineChart width={750} height={350} data={showIotData.chartData}>
          <XAxis dataKey="name" />
          <YAxis/>
          <CartesianGrid stroke="#eee" strokeDasharray="5 7" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temp" stroke="var(--color-blue)"  name="Temp" />
          <Line type="monotone" dataKey="hum" stroke="var(--color-red)" name="Hum" />
          <Line type="monotone" dataKey="gas" stroke="black" name="Gas" />
        </LineChart>
      </div>
    </div>
  )
}

export default ShowIot