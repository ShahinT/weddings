import {ChangeEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store";
import {addEvent} from "../store/event.ts";
import {AddEventPayload} from "../interfaces";

interface Dool {
  id: keyof AddEventPayload,
  placeHolder: string,
  type: string,
  value: string
}
const SuperAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [inputs, setInputs] = useState<Dool[]>([
    {id:"address", placeHolder: "Address", type:"text", value:""},
    {id:"bride", placeHolder: "Bride", type:"text", value:""},
    {id:"groom", placeHolder: "Groom", type:"text", value:""},
    {id:"email", placeHolder: "Email", type:"email", value:""},
    {id:"name", placeHolder: "Event Name", type:"text", value:""},
    {id:"startTime", placeHolder: "Date", type:"datetime-local", value:""},
  ]);
  const inputHandler = (index: number, value: string) => {
    const updatedInputs: Dool[] = [...inputs];
    updatedInputs[index].value = value;
    setInputs(updatedInputs);
  }
  const addEventHandler = () => {
    const eventInputs: AddEventPayload = {
      name: '',
      bride: '',
      groom: '',
      startTime: '',
      address: '',
      email: ''
    }
    inputs.forEach((item) => {
      eventInputs[item.id] = item.value;
    })
    dispatch(addEvent({...eventInputs}));
  }

  return (
    <div className={'p-4'}>
      <div>
        {/*<input type="email" className="input-primaty" placeholder="Email" />*/}
        {inputs.map((input, index) => (
          <div key={index} >
            <label htmlFor="" >{input.placeHolder}</label>
            <input
              onChange={(event: ChangeEvent<HTMLInputElement>) => inputHandler(index, event.target.value)}
              type={input.type}
              className="input-primaty mb-3"
            />
          </div>
        ))}
      </div>
      <div>
        <button onClick={() => addEventHandler()} type="submit" className="btn-primary w-full mt-3">Add Event</button>
      </div>
    </div>
  )
}
export default SuperAdmin;