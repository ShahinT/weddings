import {IconChevronRight, IconGeo} from "../../../components/Icons.tsx";
import {Event} from "../../../interfaces";

interface props {
  currentEvent: Event
}
const EventDetails = ({currentEvent}: props) => {
  return (
    <div className="shah-card-hover flex justify-between items-center">
      <div className={'flex items-center'}>
        <div className="mr-3"><IconGeo size={'4'} /></div>
        <div>{currentEvent!.address}</div>
      </div>
      <div>
        <IconChevronRight />
      </div>
    </div>
  )
}

export default EventDetails;