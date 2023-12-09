import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {updateGuest} from "../../store/event.ts";
import TopNavigationMenu from "../../components/TopNavigationMenu.tsx";
import {AppDispatch, RootState} from "../../store";
import {Guest} from "../../interfaces";

const GuestDetail = () => {
  const {guestId} = useParams();
  // const currentGuest = useSelector(state => getGuestById(state, guestId));
  const currentGuest: Guest | undefined = useSelector((state: RootState) => state.event.currentGuests.find((item: Guest) => item.id === guestId));
  const [textAreaValue, setTextAreaValue] = useState<string>('');
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (currentGuest){
      console.log(currentGuest)
      setTextAreaValue(currentGuest.comment ? currentGuest.comment: '');
    }
  },[currentGuest])

  const textAreaValueHandler = (value: string) : void => {
    setTextAreaValue(value);
  }
  const saveChangesHandler = async () => {
    if (currentGuest){
      await dispatch(updateGuest({guestId: currentGuest.id, comment: textAreaValue}));
      navigate(-1);
    }

  }
  return (
    <>
      <TopNavigationMenu showBackButton={true} title={'Guest details'}/>
      <div className={'p-4'}>
        {currentGuest &&
          <div className={'shah-card'}>
            <div className={'flex justify-between items-center'}>

              <div className={'text-xl'}>
                {currentGuest.firstName} {currentGuest.lastName}
              </div>
              <div>
                <button className={'btn-primary-small'} onClick={saveChangesHandler}>
                  {currentGuest.accepted ? <span>Spara</span> : <span>Tacka Ja</span>}
                </button>
              </div>
            </div>
            <hr className="my-4 border-t border-gray-300 dark:border-gray-700 mx-[-1rem]" />
            <div>

              <label htmlFor="message" className="mt-6 block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your
                message
              </label>
              <textarea
                onChange={(e) => textAreaValueHandler(e.target.value)}
                value={textAreaValue}
                id="message" rows={4}
                className="shah-text-area"
                placeholder="Write your thoughts here...">
               </textarea>

            </div>
          </div>}
      </div>

    </>
  )
}
export default GuestDetail;