import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const OwnerLayout = () => {
  return (
    <div className="owner-panel">
      <Sidebar />
      <div className="main-section">
        <Header />
        <div className="content-area">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default OwnerLayout;
