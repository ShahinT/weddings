import {useState} from "react";
import {Event} from "../../../interfaces";

export interface Timer {
  days: number,
  hours: number,
  minutes: number,
  seconds: number
}

export interface props{
  currentEvent: Event | null
}

const CountDown = ({currentEvent}: props) => {

  const [eventIsOver, setEventIsOver] = useState<boolean>(false);
  const [timerValues, setTimerValues] = useState<Timer>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const targetTime: number = new Date(currentEvent!.startTime).getTime();
  const interval: number = window.setInterval(() => {
    const now: number = new Date().getTime();
    const distance: number = targetTime - now;
    if (distance < 0) {
      clearInterval(interval);
      setEventIsOver(true);
      return;
    }
    setTimerValues({
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    })
  }, 1000);


  return (
    <div className="shah-card">
      <div className="text-center text-xl">
        {/*{currentEvent?.name}*/}
        Event starts at
      </div>
      <div className="mt-4">
        {/*<input onChange={(event) => setDateValue(event.target.value)} value={dateValue} className={'input-primaty'} type="datetime-local"/>*/}
        {/*<button className="btn-primary mt-2" onClick={() => startTimer()}>SET</button>*/}
      </div>
      { !eventIsOver &&
        <div className="flex text-center mx-auto">
          { Object.keys(timerValues).map((key) => (
            <div key={key} className="flex-1 bg-slate-100 p-2 rounded mx-1">
              <div className="text-3xl">{timerValues[key as keyof Timer]}</div>
              <div className="text-sm">{key}</div>
            </div>
          ))}
        </div>
      }
    </div>
  )
}
export  default CountDown;
{/*<input className={'input-primaty'} type="datetime-local"/>*/}
