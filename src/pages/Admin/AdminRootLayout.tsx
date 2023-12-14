import BottomNavigationAdmin from "../../components/BottomNavigationAdmin.tsx";
import {Outlet} from "react-router-dom";
const AdminRootLayout = () => {
  return (
    <>
      <Outlet />
      <BottomNavigationAdmin/>
    </>
  )
}
export default AdminRootLayout;