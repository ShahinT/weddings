import {useSelector} from "react-redux";
import {RootState} from "../../../store";

const EventDetails = () => {
  const currentEvent = useSelector((state: RootState) => state.event.currentEvent);
  console.log(currentEvent)
  return (
    <div className="shah-card">
      {currentEvent?.name}
    </div>
  )
}
export  default EventDetails;