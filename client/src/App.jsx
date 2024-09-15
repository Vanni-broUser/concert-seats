import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './layouts/Navbar';

import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Reservation from './pages/Reservation';

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/reservation/:showId" element={<Reservation />} />
      </Routes>
    </Router>
  );
}

export default App;
