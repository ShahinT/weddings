import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {Event} from "../../interfaces";
import {IconChevronRight} from "../../components/Icons.tsx";
import {useNavigate} from "react-router-dom";
import {setAdminEvents} from "../../store/event.ts";
import {logout} from "../../store/authentication.ts";

const AdminLandingPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();
  const events: Event[] = useSelector((state: RootState) => state.event.adminEvents);
  useEffect(() => {
    const fetchevents = async (): Promise<void> => {
      await dispatch(setAdminEvents());
    };
    fetchevents();
  }, [dispatch]);

  const logoutHandler = async (): Promise<void> => {
    await dispatch(logout());
    navigate("/login");
  }

  return (
    <div>
      <div className="p-4">
        <div className="flex justify-between">
          <div className={'font-semibold text-xl'}>
            Your events
          </div>
          <button onClick={() => logoutHandler()} className="btn-danger">Logout</button>
        </div>
      </div>
      <div className="p-2">
        {events.length > 0 && events.map((event) => (
          <div className={'shah-card-hover mb-2'} key={event.id} onClick={() => navigate(`/admin/${event.id}/guests-list`)}>
            <div className="flex justify-between items-center">
              <div key={event.id}>
                {event.name}
              </div>
              <div>
                <IconChevronRight/>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  )
}
export default AdminLandingPage;