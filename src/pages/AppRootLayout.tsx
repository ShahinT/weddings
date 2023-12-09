import {Outlet, useMatch, useNavigate} from "react-router-dom";
import {IconArrowLeft} from "../components/Icons.tsx";
import TopNavigationMenu from "../components/TopNavigationMenu.tsx";

const AppRootLayout = () => {

  return (
    <>
      <main>
        <Outlet />
      </main>
      {/*<div>Footer</div>*/}
    </>
  )
}
export default AppRootLayout;