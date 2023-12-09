import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import TopNavigationMenu from "../../components/TopNavigationMenu.tsx";
import {RootState} from "../../store";

const LandingPage = () => {
  const currentCompanion = useSelector((state: RootState) => state.event.currentCompanion);

  return (
    <>
      <TopNavigationMenu showBackButton={false} />
      <div className={'p-2'}>
        {currentCompanion &&
          <>
            <div className={'text-center shah-card'}>
              <div className={'text-2xl'}>Hej {currentCompanion.id}</div>
              <div className={'mt-2'}>Deltar ni i vårt bröllop?</div>
              <div className={'mt-6 mb-1'} >
                <NavLink className={'btn-primary mr-5'} to={'companion-guests-list'}>No</NavLink>
                <NavLink className={'btn-primary'} to={'companion-guests-list'}>Yes</NavLink>
              </div>
            </div>
          </>
        }
      </div>
    </>
  )
}

export default LandingPage;