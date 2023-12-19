import BottomNavigationAdmin from "../../components/BottomNavigationAdmin.tsx";
import {Outlet, useParams} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentAdminEvent} from "../../store/event.ts";
import {AppDispatch, RootState} from "../../store";
const AdminRootLayout = () => {
  const { eventId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const currentAdminEvent = useSelector((state: RootState) => state.event.currentAdminEvent);
  useEffect(() => {
    dispatch(setCurrentAdminEvent({eventId}));
  }, [eventId, dispatch])
  return (
    <>
      {currentAdminEvent && (
        <>
          <Outlet />
          <BottomNavigationAdmin/>
        </>
      )}
    </>
  )
}
export default AdminRootLayout;