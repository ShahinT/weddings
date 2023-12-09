import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {IconCircle, IconCircleCheck} from "../../components/Icons.tsx";
import TopNavigationMenu from "../../components/TopNavigationMenu.tsx";
import {RootState} from "../../store";
import {Guest} from "../../interfaces";

const GuestsList = () => {
  const navigate = useNavigate();
  const currentGuests: Array<Guest> = useSelector((state: RootState) => state.event.currentGuests);
  const toGuestDetailsHandler = (guestId: string) => {
    navigate(`../guest-detail/${guestId}`);
  }
  return(
    <div>

      <TopNavigationMenu showBackButton={true} title={'Guests list'} />
      <div className={'p-4'}>
        {
          currentGuests.length > 0 && currentGuests.map(guest =>

            <div key={guest.id} onClick={() => toGuestDetailsHandler(guest.id)} className={'shah-card-hover mb-2'}>
              <div className={'flex justify-between items-center'}>
                <div className="font-normal text-gray-700 dark:text-gray-400">
                  {guest.firstName} {guest.lastName}
                </div>
                <div>
                  {guest.accepted ? <IconCircleCheck /> : <IconCircle />}
                </div>
              </div>
            </div>
          )
        }
      </div>


    </div>
  )
}
export default GuestsList;

// <div key={guest.id} className={'hover:bg-red-200 cursor-pointer p-1'} onClick={() => toGuestDetailsHandler(guest.id)}>
//   {guest.name}
// </div>