import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {IconInfo, IconSpinner} from "../../components/Icons.tsx";
import TopNavigationMenu from "../../components/TopNavigationMenu.tsx";
import {AppDispatch, RootState} from "../../store";
import {Companion, Guest, Event} from "../../interfaces";
import {submitinvitation} from "../../store/event.ts";

const GuestsList = () => {
  const navigate = useNavigate();
  const currentGuests: Array<Guest> = useSelector((state: RootState) => state.event.currentGuests);
  const dispatch = useDispatch<AppDispatch>()
  const currentEvent: Event | null = useSelector((state: RootState) => state.event.currentEvent)
  const currentCompanion: Companion | null = useSelector((state: RootState) => state.event.currentCompanion)
  const toGuestDetailsHandler = (guestId: string): void => {
    navigate(`../guest-detail/${guestId}`);
  }

  const submitHandler = async (): Promise<void> => {
    await dispatch(submitinvitation());
    navigate(`/event/${currentEvent?.id}/${currentCompanion?.id}`);
  }

  return (
    <div>

      <TopNavigationMenu showBackButton={true} title={'Guests list'}/>
      {currentGuests.length > 0 ?
        <div className={'p-4'}>
          {
            currentGuests.map(guest =>
              <div key={guest.id} onClick={() => toGuestDetailsHandler(guest.id)} className={'shah-card-hover mb-2'}>
                <div className={'flex justify-between items-center'}>
                  <div className="font-normal text-gray-700 dark:text-gray-400">
                    {guest.firstName} {guest.lastName}
                  </div>
                  <div>
                    { guest.status === 'pending' ?
                      <div className={`text-xs text-gray-500`}>Inte svarat än</div> : guest.status === 'accepted'?
                        <div className={`text-xs text-green-500`}>Tackat ja</div> : guest.status === 'declined'?
                        <div className={`text-xs text-red-500`}>Tackat nej</div> : 'ERROR'
                      // <><div className={`mr-2 text-xs ${guest.status === 'pending'&& 'text-gray-500'}`}>Inte svarat än</div></>
                    }
                  </div>
                </div>
              </div>
            )
          }
          <div className="mt-6 text-center">
            { currentGuests.find(guest => guest.status === 'pending') ?
              <div className={'mt-8 flex justify-center'}><IconInfo /> <div className={'ml-2'}>Alla måste svara innan svaret kan skickas in</div></div> :
              <button onClick={() => submitHandler()} className={'btn-primary-full'}>Skicka in</button>
            }
          </div>
        </div> :
        <div className={'flex flex-col h-screen justify-center items-center'} style={{ marginTop: '-56px' }}>
          <IconSpinner/>
        </div>
      }



    </div>
  )
}
export default GuestsList;

// <div key={guest.id} className={'hover:bg-red-200 cursor-pointer p-1'} onClick={() => toGuestDetailsHandler(guest.id)}>
//   {guest.name}
// </div>