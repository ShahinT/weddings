import {Outlet} from "react-router-dom";

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