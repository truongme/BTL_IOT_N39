import { Route, Routes, useNavigate } from 'react-router-dom';
import './index.css';

import Setting from './componets/setting/Setting';
import Header from './componets/layout/Header';
import Home from './componets/home/Home';
import Login from './componets/login/Login';
import Account from './componets/account/Account';
import EditAccount from './componets/account/EditAccount';
import { ShowIotProvider } from './componets/show/ShowIotContext';

function App() {
  const navigate = useNavigate();

  const isLoginPage = () => {
    return window.location.pathname === '/';
  };

  const goToLoginPage = () => {
    navigate('/');
  };

  return (
  <ShowIotProvider>
    <div className="container_app">
      {!isLoginPage() && (
        <div className="header">
          <Header />
        </div>
      )}
      <div className="body">
          <Routes>
            <Route path="/" element={<Login onNavigate={goToLoginPage} />}
            ></Route>
            <Route path="/home" element={<Home />}></Route>
            <Route path="/account" element={<Account />}></Route>
            <Route path="/account/:id" element={<EditAccount/>}></Route>
            <Route path="/setting" element={<Setting />}></Route>
          </Routes>
        
      </div>
    </div>
  </ShowIotProvider>
  );
}

export default App;
