import Login from "./components/login/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";
import { Routes, Route } from "react-router-dom";
import Analytics from "./components/analytics/Analytics";
import Attendances from "./components/attendances/Attendances";
import Branches from "./components/branches/Branches";
import Inquiries from "./components/inquiries/Inquiries";
import Invoices from "./components/invoices/Invoices";
import Students from "./components/students/Students";
import Page401 from "./components/page401/Page401";
import Layout from "./components/layout/Layout";
import RequireAuth from "./components/require-auth/RequireAuth";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/unauthorized" element={<Page401 />}></Route>

        <Route element={<RequireAuth allowedRoles={["Admin"]} />}>
          <Route path="/analytics" element={<Analytics />}></Route>
          <Route path="/branches" element={<Branches />}></Route>
          <Route path="/inquiries" element={<Inquiries />}></Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["Admin", "Partner"]} />}>
          <Route path="/students" element={<Students />}></Route>
          <Route path="/attendances" element={<Attendances />}></Route>
          <Route path="/invoices" element={<Invoices />}></Route>
        </Route>

        {/* <Route path="*" element={<Page404 />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
