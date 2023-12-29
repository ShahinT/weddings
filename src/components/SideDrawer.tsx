import {useContext} from "react";
import {logout} from "../store/authentication.ts";
import {NavLink, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store";
import {DrawerContext} from "../contexts/DrawerContext.ts";
import {IconChevronRight} from "./Icons.tsx";

const SideDrawer = () => {
  // const [showSideBarDrawer, setShowSideBarDrawer] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const logoutHandler = async (): Promise<void> => {
    await dispatch(logout());
    navigate("/login");
  };
  const {isDrawerOpen, setIsDrawerOpen} = useContext(DrawerContext)

  // const handleEventFromChild = (): void => {
  //   setShowSideBarDrawer(!showSideBarDrawer)
  // }
  return (
    <>
      { isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}
      <div className={`fixed flex flex-col z-50 w-44 top-0 left-0 h-full bg-white shadow-lgtransform transition-transform duration-300 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex-1">
          <div className="flex justify-center py-4 mb-4 font-bold">
            <img src="https://i.pinimg.com/736x/11/94/b9/1194b96640d448cb4f0e6aaa68e998dc.jpg" className="w-16" alt=""/>
          </div>
          <div>
            <NavLink to={'/admin'} className="btn-link-nav">
              <div>All Events</div> <IconChevronRight />
            </NavLink>
          </div>
        </div>
        <div className="flex justify-center py-4">
          <button className="btn-danger" onClick={() => logoutHandler()}>Logout</button>
        </div>
      </div>
    </>
  )
}
export default SideDrawer;