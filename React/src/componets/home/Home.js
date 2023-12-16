import React from 'react'
import ShowIot from '../show/ShowIot'

import './Home.css'
import ChatBot from '../chatbot/ChatBot'

const Home = () => {
  return (
    <div className='home_ctn'> 
      <div>
        <ShowIot></ShowIot>
      </div>
        <ChatBot></ChatBot>
    </div>
  )
}

export default Home