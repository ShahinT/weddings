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
    if (currentGuest) {
      setTextAreaValue(currentGuest.comment ? currentGuest.comment : '');
      setResponseValue(currentGuest.status);
    }
  }, [currentGuest])

  const textAreaValueHandler = (value: string): void => {
    setTextAreaValue(value);
  }
  const saveChangesHandler = async () : Promise<void> => {
    if (currentGuest) {
      await dispatch(updateGuest({guestId: currentGuest.id, comment: textAreaValue, status: (responseValue === 'accepted') ? 'accepted' : 'declined'}));
      navigate(-1);
    }
  }

  const [responseValue, setResponseValue] = useState<string>('');

  return (
    <>
      {currentGuest &&
        <>
          <TopNavigationMenu showBackButton={true} title={'Guest details'}>
            {responseValue &&
              <button className={'btn-primary-small'} onClick={() => saveChangesHandler()}>
                Spara
              </button>
            }
          </TopNavigationMenu>
          <div className={'p-4'}>
            <div className={'shah-card'}>
              <div className={''}>

                <ul className="flex justify-center items-center gap-x-2">
                  <li>
                    <input
                      type="radio"
                      id="accepted"
                      value="accepted"
                      className="hidden peer"
                      checked={responseValue === "accepted"}
                      onChange={() => setResponseValue('accepted')}
                      required
                    />
                    <label htmlFor="accepted"
                           className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="font-semibold">Jag deltar</div>
                    </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id="declined"
                      value="declined"
                      className="hidden peer"
                      checked={responseValue === "declined"}
                      onChange={() => setResponseValue('declined')}
                    />
                    <label htmlFor="declined"
                           className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-red-500 peer-checked:border-red-600 peer-checked:text-red-400 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">
                      <div className="font-semibold">Jag deltar ej</div>
                    </label>
                  </li>
                </ul>
              </div>


              {responseValue === 'accepted' &&
                <>
                  <hr className="my-4 border-t border-gray-300 dark:border-gray-700 mx-[-1rem]"/>
                  <div>
                    <div className={'text-xl'}>
                      {currentGuest.firstName} {currentGuest.lastName}
                    </div>

                    <label htmlFor="message"
                           className="mt-6 block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      Your message
                    </label>
                    <textarea
                      onChange={(e) => textAreaValueHandler(e.target.value)}
                      value={textAreaValue}
                      id="message" rows={4}
                      className="shah-text-area"
                      placeholder="Write your thoughts here...">
                    </textarea>
                  </div>
                </>
              }
            </div>
          </div>
        </>

      }

    </>
  )
}
export default GuestDetail;