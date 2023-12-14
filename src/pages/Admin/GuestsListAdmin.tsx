import {useEffect} from "react";
import {useParams} from "react-router-dom";
// import {query, collectionGroup, where, getDocs} from "firebase/firestore";
// import {db} from "../../plugins/firebase.ts";
// import {Guest} from "../../interfaces";

const GuestsListAdmin = () => {
  const { eventId } = useParams();
  // const [guests, setGuests] = useState<Guest[]>([]);
  useEffect(() =>{

    // const companionsQuery = query(collectionGroup(db, "companions"), where('eventId', '==' ,eventId));

    // const fetchData = async () => {
    //   try {
    //     const companionsSnapshot = await getDocs(companionsQuery);
    //     const allGuests = companionsSnapshot.docs
    //       .flatMap(doc => doc.data().guests || [])
    //       .filter(guest => guest); // assuming Guest is a truthy value
    //     setGuests(allGuests);
    //   } catch (err) {
    //     console.error('Error fetchData:', err);
    //   }
    // };


    const fetchData = async () => {
      try {
        // const companionsSnapshot = await getDocs(companionsQuery);
        // console.log(companionsSnapshot);
        // const allGuests = companionsSnapshot.docs.flatMap(doc => doc.data())
        // companionsSnapshot.forEach(companionDoc => {
        //   const guests: Guest[] = companionDoc.data().guests || [];
        //   allGuests.push(...guests);
        // });
        // setGuests(allGuests);
      } catch (err){
        console.error('Error fetchData:',err);
      }
    };

    fetchData().then(() => {});

  }, [eventId])
  return (
    <>
      <div className="p-4 flex justify-between items-center">
        <div className={'flex font-semibold text-xl'}>
          <div>Guests list</div>
        </div>
        {/*<div className='flex space-x-5 text-xl items-center'>*/}
        {/*  <div className="bg-blue-100 text-blue-800 text-lg font-medium mr-1 px-3 py-1 rounded dark:bg-blue-900 dark:text-blue-300">150</div>*/}
        {/*  <div className="text-green-600">90</div>*/}
        {/*  <div className="text-gray-400">30</div>*/}
        {/*  <div className="text-red-600">2</div>*/}
        {/*</div>*/}
      </div>
      {/*{guests && guests.map((guest:Guest) => (*/}
      {/*  <div key={guest.id}>*/}
      {/*    {guest.firstName}*/}
      {/*  </div>*/}
      {/*) )}*/}
    </>
  )
}
export default GuestsListAdmin;