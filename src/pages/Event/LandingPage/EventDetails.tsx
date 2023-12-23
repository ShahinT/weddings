import {useSelector} from "react-redux";
import {RootState} from "../../../store";
import {useState} from "react";

const EventDetails = () => {
  const currentEvent = useSelector((state: RootState) => state.event.currentEvent);
  // const [dateValue, setDateValue] = useState('');
  const [timerValue, setTimer] = useState('');
  if (currentEvent){
    const targetTime = new Date(currentEvent.startTime).getTime();

    const interval: number = window.setInterval(() => {
      const now: number = new Date().getTime();
      const distance: number = targetTime - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimer('Timer is up');
        return;
      }

      const days: number = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours: number = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes: number = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds: number = Math.floor((distance % (1000 * 60)) / 1000);

      setTimer(`${days}d ${hours}h ${minutes}m ${seconds}s `);
    }, 1000);
  }



  return (
    <div className="shah-card">
      <div className="text-center">
        {currentEvent?.name}
      </div>
      <div className="mt-4">
        {/*<input onChange={(event) => setDateValue(event.target.value)} value={dateValue} className={'input-primaty'} type="datetime-local"/>*/}
        {/*<button className="btn-primary mt-2" onClick={() => startTimer()}>SET</button>*/}
      </div>
      { timerValue &&
        <div>
          {timerValue}
        </div>
      }
    </div>
  )
}
export  default EventDetails;
{/*<input className={'input-primaty'} type="datetime-local"/>*/}
