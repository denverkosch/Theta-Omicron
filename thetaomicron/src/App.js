import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/home';
import Navbar from './components/navbar';
import Rush from "./pages/rush";
import Portal from "./pages/portal";
import Directory from "./pages/dir";


function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path='rush' element={<Rush/>}/>
          <Route path='portal' element={<Portal/>}/>
          <Route path='directory' element={<Directory/>}>
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
