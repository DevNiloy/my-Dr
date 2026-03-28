import { Outlet } from "react-router-dom";
import Navbar from "../shared_components/Navbar";
import Footer from "../shared_components/Footer";

function ParenLayout() {
  return (
    <div>

        <Navbar/>
      <Outlet></Outlet>
      <Footer/>
    </div>
  );
}

export default ParenLayout;
