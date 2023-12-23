import {useSelector} from "react-redux";
import TopNavigationMenu from "../../../components/TopNavigationMenu.tsx";
import {RootState} from "../../../store";
import WelcomeCard from "./WelcomeCard.tsx";
import {Companion, Event} from "../../../interfaces";
import CountDown from "./CountDown.tsx";
import EventDetails from "./EventDetails.tsx";

const Index = () => {
  const currentCompanion: Companion | null = useSelector((state: RootState) => state.event.currentCompanion);
  const currentEvent: Event | null = useSelector((state: RootState) => state.event.currentEvent);

  return (
    <>
      <TopNavigationMenu showBackButton={false} />
      { currentCompanion && currentEvent &&
        <div className={'p-2 md:w-96 mx-auto'}>
          <div className="mb-2">
            <WelcomeCard companion={currentCompanion} />
          </div>
          <div className="mb-2">
            <CountDown currentEvent={currentEvent} />
          </div>
          <div className="mb-2">
            <EventDetails currentEvent={currentEvent} />
          </div>
        </div>
      }

    </>
  )
}

export default Index;