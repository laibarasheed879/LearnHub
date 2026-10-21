
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/Approutes";
import AppNavbar from "./components/Navbar";
import AnnouncementBar from "./components/AnnouncementBar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <AnnouncementBar />
      <AppNavbar />

      <AppRoutes />

      <Footer />
      <ScrollToTop />
  
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="dark"
        newestOnTop
      />
    </BrowserRouter>
  );
}

export default App;
