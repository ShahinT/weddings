import {useSelector} from "react-redux";
import TopNavigationMenu from "../../components/TopNavigationMenu.tsx";
import {RootState} from "../../store";
import LandingPageWelcomeCard from "../../components/LandingPageWelcomeCard.tsx";
import {Companion} from "../../interfaces";

const LandingPage = () => {
  const currentCompanion: Companion | null = useSelector((state: RootState) => state.event.currentCompanion);
  return (
    <>
      <TopNavigationMenu showBackButton={false} />
      { currentCompanion &&
        <div className={'p-2'}>
          <LandingPageWelcomeCard companion={currentCompanion} />
        </div>
      }

    </>
  )
}

export default LandingPage;