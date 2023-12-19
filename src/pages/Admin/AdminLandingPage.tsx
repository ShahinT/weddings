import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../store";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../plugins/firebase.ts";
import {Event} from "../../interfaces";
import {IconChevronRight} from "../../components/Icons.tsx";
import {useNavigate} from "react-router-dom";
import {setAdminEvents} from "../../store/event.ts";

const AdminLandingPage = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.authentication.currentUser);
  const [events, setEvents] = useState<Event[]>([])
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(setAdminEvents())
    const fetchevents = async (): Promise<void> => {
      const eventsQuery = query(collection(db, "events"), where("userId", "==", currentUser?.uid));
      const eventsSnapshot = await getDocs(eventsQuery);
      const fetchedEvents = eventsSnapshot.docs.map((event) => (
        {
          id: event.data().id,
          userId: event.data().userId,
          name: event.data().name
        }
      ))
      setEvents(fetchedEvents);
    };
    fetchevents();
  }, [currentUser, events, dispatch])

  return (
    <div>
      <div className="p-4">
        <div className="flex justify-between">
          <div className={'font-semibold text-xl'}>
            Your events
          </div>
        </div>
      </div>
      <div className="p-2">
        {events.length > 0 && events.map((event) => (
          <div className={'shah-card-hover'} key={event.id} onClick={() => navigate(`/admin/${event.id}/guests-list`)}>
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