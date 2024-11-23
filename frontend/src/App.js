import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  // Import React Router
import bg from './img/bg.png';
import { MainLayout } from './styles/Layouts';
import Orb from './Components/Orb/Orb';
import Navigation from './Components/Navigation/Navigation';
import Dashboard from './Components/Dashboard/Dashboard';
import Income from './Components/Income/Income';
import Expenses from './Components/Expenses/Expenses';
import { useGlobalContext } from './context/globalContext';
import Login from './Components/Login/login';
import Register from './Components/Register/register';

function App() {
  const [active, setActive] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to manage login status

  const global = useGlobalContext();
  console.log(global);

  const displayData = () => {
    switch (active) {
      case 1:
        return <Dashboard />;
      case 2:
        return <Dashboard />;
      case 3:
        return <Income />;
      case 4:
        return <Expenses />;
      default:
        return <Dashboard />;
    }
  };

  const orbMemo = useMemo(() => {
    return <Orb />;
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <AppStyled bg={bg} className="App">
      <Router>
        <Routes>
          {/* Route for login page */}
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />

          {/* Protected route for dashboard page */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn ? (
                <>
                  {orbMemo}
                  <MainLayout>
                    <Navigation active={active} setActive={setActive} />
                    <main>{displayData()}</main>
                  </MainLayout>
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          
          {/* Default redirect to login if the user is not logged in */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} />} />
        </Routes>
      </Router>
    </AppStyled>
  );
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`;

export default App;
