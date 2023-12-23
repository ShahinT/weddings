import { useNavigate} from "react-router-dom";
import {useState} from "react";
import {Companion} from "../../../interfaces";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {declineCurrentGuests, submitinvitation} from "../../../store/event.ts";

interface props {
  companion: Companion,
}

const WelcomeCard = ({companion}: props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  const guetsCount: number = useSelector((state: RootState) => state.event.currentGuests.length)
  const [pronounce] = useState<string>((): string => guetsCount > 1 ? 'ni' : 'du')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [questionSentence] = useState<string>((): string => {
    return guetsCount === 1 ? 'Deltar du i vårt bröllop?' :
      guetsCount === 2 ? 'Deltar ni båda eller någon av er i vårt bröllop?' :
        guetsCount > 2 ? 'Deltar ni alla eller några av er i vårt bröllop?' : ''
  })
  const namesContainer: string = useSelector((state: RootState) => {
    const guetsFirstNames: string[] = state.event.currentGuests.map(guest => guest.firstName.split(' ')[0]);
    let stringOfNames: string = '';
    guetsFirstNames.forEach((name: string, index: number): void => {
      stringOfNames = stringOfNames + (index === 0 ? '' : (index > 1 || guetsFirstNames.length === 2 ? ' och ' : ', ')) + name;
    });
    return stringOfNames;
  })

  const declineHandler = async () : Promise<void> => {
    await dispatch(submitinvitation());
    await dispatch(declineCurrentGuests())
    setShowModal(false);
  }

  return (
    <>
      <div className={'text-center shah-card'}>
        <div className={'text-xl'}>Hej {namesContainer}</div>
        <div className={'mt-2'}>
          { companion.submitted ?
            <div>Tack för {guetsCount > 1 ? 'ert' : 'ditt'} svar ❤️ </div> :
            <div>{questionSentence}</div>
          }
        </div>
        {!companion.submitted &&
          <div className={'mt-6 mb-1'}>
            <button className={'btn-cancel mr-7'} onClick={() => setShowModal(true)}>Nej</button>
            <button className={'btn-primary'} onClick={() => navigate("companion-guests-list")}>Ja, det gör vi</button>
          </div>
        }
      </div>
      {showModal &&
        <div id="modal" className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 w-80 rounded">
            <div className="text-center">Är du säker att {pronounce} vill tacka nej?</div>
            <div className="flex justify-center mt-7">
              <button className="btn-cancel mx-2" onClick={() => setShowModal(false)}>Avbryt</button>
              <button className="btn-danger mx-2" onClick={() => declineHandler()}>Tacka nej</button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export default WelcomeCard;