import {useSelector} from "react-redux";
import TopNavigationMenu from "../../../components/TopNavigationMenu.tsx";
import {RootState} from "../../../store";
import WelcomeCard from "./WelcomeCard.tsx";
import {Companion} from "../../../interfaces";
import EventDetails from "./EventDetails.tsx";

const Index = () => {
  const currentCompanion: Companion | null = useSelector((state: RootState) => state.event.currentCompanion);
  return (
    <>
      <TopNavigationMenu showBackButton={false} />
      { currentCompanion &&
        <div className={'p-2'}>
          <div className="mb-2">
            <WelcomeCard companion={currentCompanion} />
          </div>
          <div className="mb-2">
            <EventDetails />
          </div>
        </div>
      }

    </>
  )
}

export default Index;