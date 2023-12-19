import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Companion, Guest} from "../../interfaces";
import {IconComment, IconPeople, IconSearch} from "../../components/Icons.tsx";
import {ChangeEvent, useMemo, useState} from "react";

export interface Counters {total: number, accepted: number, declined: number, pending: number}
export type CounterKey = keyof Counters;
export type Status = 'accepted' | 'declined' | 'pending';
export interface StatusBox {id: string, title: CounterKey}

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
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);

  const filteredCompanions: NestedCompanion[] = useMemo(() => {
    const lowerCasedSearchValue: string = searchValue.toLowerCase();
    const doesGuestMatchSearch =  ((companion: NestedCompanion) =>
      companion.guests.some((guest: Guest) =>
        guest.firstName.toLowerCase().includes(lowerCasedSearchValue) ||
        guest.lastName.toLowerCase().includes(lowerCasedSearchValue)
      ));
    return event.companions.filter(doesGuestMatchSearch)
  }, [event, searchValue]);

  const selectCompanionHandler = (companion: Companion): void => {
    setSelectedCompanion(companion);
    setShowCompanionModal(true)
  }

  // const filteredGuests = useMemo<Guest[]>(()=> {
  //   const lowerCasedSearchValue: string = searchValue.toLowerCase();
  //   const doesGuestMatchSearch = (guest: Guest) =>
  //     (guest.firstName.toLowerCase().includes(lowerCasedSearchValue) ||
  //     (guest.lastName.toLowerCase().includes(lowerCasedSearchValue)));
  //
  //   return guests.filter(doesGuestMatchSearch)
  // }, [guests, searchValue])

  // const sortedAndFilteredGuests: Guest[] = filteredGuests.sort((a: Guest,b: Guest) => a.companionId.localeCompare(b.companionId));

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

  return (
    <>
      <div className="p-4 mb-2 flex justify-between items-center">
        <div className={'flex font-semibold text-xl'}>
          <div>Guests list</div>
        </div>
        <div>
          <button onClick={() => navigate("../add-guest")} className="btn-primary-small">Add guest</button>
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
      <div>
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

        <div className="p-2">
          {filteredCompanions && filteredCompanions.map((companion: NestedCompanion) => (
            <div className="flex  mb-2  bg-white" key={companion.id} onClick={() => selectCompanionHandler(companion)}>
              <div className="w-11/12 border rounded-l-lg border-gray-200">
                {companion.guests.map((guest: Guest, index: number) => (
                  <div key={guest.id}>
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
              <div className="w-1/12 bg-slate-400 rounded-r-lg flex items-center justify-center">
                <IconPeople size="3" color="white" />
              </div>
            </div>
          ))}
        </div>

        {/*<div className="p-2">*/}
        {/*  {sortedAndFilteredGuests && sortedAndFilteredGuests.map((guest: Guest, index: number) => (*/}
        {/*    <div className={`p-4 bg-indigo-10 border-r border-l border-t border-gray-200 justify-between items-center ${sortedAndFilteredGuests[index+1]?.companionId === guest.companionId ? "" : "mb-4 border-b border-gray-200" }`} key={guest.id}>*/}
        {/*      <div>*/}
        {/*        <div className={guest.status === 'pending' ? 'text-gray-400': guest.status === 'accepted' ? 'text-green-600' : 'text-red-600'}>*/}
        {/*          {guest.firstName} {guest.lastName}*/}
        {/*        </div>*/}
        {/*        {guest.comment && (*/}
        {/*          <div className="flex items-center text-sm">*/}
        {/*            <IconComment /> <span className="ml-2 text-gray-500">{guest.comment}</span>*/}
        {/*          </div>*/}
        {/*        )}*/}
        {/*      </div>*/}
        {/*    </div>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </div>
      {selectedCompanion && showCompanionModal &&
        <div id="modal" className="fixed z-40 inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 w-80 rounded">
            <div className="text-center">
              {selectedCompanion.url}
            </div>
            <div className="flex justify-center mt-7">
              <button className="btn-cancel mx-2" onClick={() => setShowCompanionModal(false)}>Avbryt</button>
              <button className="btn-danger mx-2">Tacka nej</button>
            </div>
          </div>
        </div>
      }
    </>
  )
}
export default GuestsListAdmin;