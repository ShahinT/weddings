import BottomNavigationAdmin from "../../components/BottomNavigationAdmin.tsx";
import {Outlet, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentAdminEvent} from "../../store/event.ts";
import {AppDispatch, RootState} from "../../store";
import SideDrawer from "../../components/SideDrawer.tsx";
import {DrawerProvider} from "../../provider/DrawerProvider.tsx";
import {IconSpinner} from "../../components/Icons.tsx";
const AdminRootLayout = () => {

  const { eventId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setLoading] = useState<boolean>(true);
  const currentAdminEvent = useSelector((state: RootState) => state.event.currentAdminEvent);
  useEffect(() => {
    setLoading(true);
    const setEventsHandler = async (): Promise<void> => {
      await dispatch(setCurrentAdminEvent({eventId}));
    }
    setEventsHandler().then(() => setLoading(false))
  }, [eventId, dispatch]);



  return (
    <>
      {currentAdminEvent && !isLoading ? (
        <>
          <DrawerProvider>
            <SideDrawer />
            <Outlet />
            <BottomNavigationAdmin/>
          </DrawerProvider>
        </>
      ) : <div className="h-screen flex justify-center items-center"><IconSpinner /></div>}
    </>
  )
}
export default AdminRootLayout;