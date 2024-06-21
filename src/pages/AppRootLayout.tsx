import {Outlet} from "react-router-dom";

const AppRootLayout = () => {

  return (
    <>
      <main>
        <Outlet />
      </main>
    </>
  )
}
export default AppRootLayout;