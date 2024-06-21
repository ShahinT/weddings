import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Guest} from "../../interfaces";
import {IconAddGuest, IconBurgerMenu, IconComment, IconPeople, IconSearch} from "../../components/Icons.tsx";
import {ChangeEvent, useContext, useMemo, useState} from "react";
import {DrawerContext} from "../../contexts/DrawerContext.ts";

export interface Counters {total: number, accepted: number, declined: number, pending: number}
export type CounterKey = keyof Counters;
export type Status = 'accepted' | 'declined' | 'pending';
export interface StatusBox {id: string, title: CounterKey}
import QRCode from "react-qr-code";
export interface NestedCompanion {
  guests: Guest[],
  id: string,
  eventId: string,
  submitted: boolean,
  url: string
}
export interface NestedEvent {
  companions: NestedCompanion[],
  id: string,
  name: string,
  userId: string
}
const GuestsListAdmin = () => {
  const navigate = useNavigate();
  const [showCompanionModal, setShowCompanionModal] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const guests: Guest[] = useSelector((state: RootState) => state.event.currentAdminGuests);
  const event: NestedEvent = useSelector((state: RootState) => state.event.currentAdminEvent as NestedEvent);
  const [selectedCompanion, setSelectedCompanion] = useState<NestedCompanion | null>(null);

  const filteredCompanions: NestedCompanion[] = useMemo(() => {
    const lowerCasedSearchValue: string = searchValue.toLowerCase();
    const doesGuestMatchSearch =  ((companion: NestedCompanion) =>
      companion.guests.some((guest: Guest) =>
        guest.firstName.toLowerCase().includes(lowerCasedSearchValue) ||
        guest.lastName.toLowerCase().includes(lowerCasedSearchValue)
      ));
    return event.companions.filter(doesGuestMatchSearch)
  }, [event, searchValue]);

  const selectCompanionHandler = (companion: NestedCompanion): void => {
    setSelectedCompanion(companion);
    setShowCompanionModal(true)
  }

  const statusBoxes: StatusBox[] = [
    {id: '1', title: 'total'},
    {id: '2', title: 'accepted'},
    {id: '3', title: 'declined'},
    {id: '4', title: 'pending'},
  ]

  const counters = guests.reduce((acc, guest: Guest) => {
    if(guest.status in acc){
      acc[guest.status as Status]++;
      acc.total++;
    }
    return acc;
  }, { total: 0, accepted: 0, declined: 0, pending: 0 })

  const { setIsDrawerOpen } = useContext(DrawerContext);

  return (
    <>
      <div className="p-4 mb-2 flex justify-between items-center">
        <div className={'flex font-semibold text-xl'}>
          <button className="btn-icon-primary mr-2" onClick={() => setIsDrawerOpen(true)}>
            <IconBurgerMenu size="4"/>
          </button>
          <div>Guests list</div>
        </div>
        <div>
          <button onClick={() => navigate("../add-guest")} className="btn-icon"><IconAddGuest size={'6'} color='action'/></button>
        </div>
      </div>
      <div className="flex bg-white text-center border border-gray-200">
        {statusBoxes.map((box: StatusBox) => (
          <div key={box.id} className="w-1/4 py-2 items-center justify-center border-r border-gray-200">
            <div className="text-xs capitalize text-gray-500">{box.title}</div>
            <div className={'text-xl'}>{counters[box.title]}</div>
          </div>
        ))}
      </div>
      <div className="md:mt-6 md:mb-2">
        <label htmlFor="default-search"
               className="my-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <IconSearch/>
          </div>
          <input type="search" id="default-search"
                 className="search-input"
                 value={searchValue}
                 onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchValue(event.target.value)}
                 placeholder="Search guests ..." required />
        </div>
      </div>
      <div>

        <div className="p-2 md:p-0">
          {filteredCompanions && filteredCompanions.map((companion: NestedCompanion) => (
            <div className="flex  mb-2  bg-white" key={companion.id}>
              <div className="w-11/12 border rounded-l-lg border-gray-200">
                {companion.guests.map((guest: Guest, index: number) => (
                  <div key={guest.id} >
                    <div className={'p-4'}>
                      <div className={guest.status === 'pending' ? 'text-gray-400': guest.status === 'accepted' ? 'text-green-600' : 'text-red-600'}>
                        {guest.firstName} {guest.lastName}
                      </div>
                      {guest.comment && (
                        <div className="flex items-center text-sm">
                          <IconComment /> <span className="ml-2 text-gray-500">{guest.comment}</span>
                        </div>
                      )}
                    </div>
                    {index+1 < companion.guests.length && <hr className="border-t border-gray-200 dark:border-gray-700 "/> }
                  </div>
                ))}
              </div>
              <div className="w-1/12 bg-slate-400 rounded-r-lg flex items-center justify-center cursor-pointer" onClick={() => selectCompanionHandler(companion)}>
                <IconPeople size="3" color="white" />
              </div>
            </div>
          ))}
        </div>

      </div>
      {selectedCompanion && showCompanionModal &&
        <div id="modal" className="fixed z-40 inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 w-10/12 rounded max-w-2xl md:py-16">

            <div className="flex justify-center">
              {selectedCompanion.guests.map(guest => (
                <div key={guest.id} className="text-center mb-8 font-bold mx-4">{guest.firstName}</div>
              ))}
            </div>
            <div className="flex justify-center p-4">
              {/*<img src="https://miro.medium.com/v2/resize:fit:990/1*FX_LPYdLaX1IPlohROEaQA.jpeg" alt="qr-code" className="w-44" />*/}
                <QRCode
                  size={256}
                  className="w-56"
                  value={selectedCompanion.url}
                  viewBox={`0 0 256 256`}
                />
            </div>
            <div className="flex justify-center mt-7">
              <button className="btn-cancel mx-2" onClick={() => setShowCompanionModal(false)}>Avbryt</button>
              <a href={selectedCompanion.url} className="btn-primary mx-2">Besök sidan</a>
            </div>
          </div>
        </div>
      }
    </>
  )
}
export default GuestsListAdmin;