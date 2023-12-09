import {Outlet, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {setCurrentEvent} from "../../store/event.ts";
import {AppDispatch} from "../../store";

const EventRootLayout = () => {
  const {eventId, companionId} = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    try {
      if (eventId && companionId) {
        dispatch(setCurrentEvent({eventId: eventId, companionId: companionId}));
        setLoading(false);
      }
    } catch (e) {
      console.error('Error fetching residences:', e);
      setLoading(false);
    }
  }, [eventId, dispatch, companionId])

  return (
    <>
      {loading ? <div>Loading...</div> : <Outlet/>}
    </>
  )
}
export default EventRootLayout
