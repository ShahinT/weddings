import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {FormEvent, useState} from "react";
import {addGuest} from "../../store/event.ts";
import {IconPlus, IconThreeDotsVertical} from "../../components/Icons.tsx";
import {GuestCreationMaterial} from "../../interfaces";
import {useParams} from "react-router-dom";



const AddGuest = () => {
  type FieldName = 'firstName' | 'lastName';
  const {eventId} = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [nameValues, setNameValues] = useState<GuestCreationMaterial[]>([
    {firstName: '', lastName: '', showDropDown: false}
  ]);
  const submitHandler = async (event: FormEvent): Promise<void> => {
    event.preventDefault();
    const res = await dispatch(addGuest({nameValues: nameValues, eventId}));
    if (res.meta.requestStatus === "fulfilled") {
      setNameValues([{firstName: '', lastName: '', showDropDown: false}]);
    }
  }
  const nameInputHandler = (index: number, fieldName: FieldName, value: string) => {
    const updatedValues: Array<{ firstName: string, lastName: string, showDropDown: boolean }> = [...nameValues];
    updatedValues[index][fieldName] = value;
    setNameValues(updatedValues);
  };

  const toggleMenu = (index: number): void => {
    const updatedValues: Array<{ firstName: string, lastName: string, showDropDown: boolean }> = [...nameValues];
    updatedValues[index].showDropDown = !updatedValues[index].showDropDown;
    setNameValues(updatedValues);
  };

  const removeNameFields = (index: number): void => {
    const updatedValues = [...nameValues];
    updatedValues.splice(index, 1);
    setNameValues(updatedValues);
  };
  const addNameFields = (): void => {
    setNameValues([...nameValues, {firstName: '', lastName: '', showDropDown: false}]);
  };
  return (
    <>
      <form onSubmit={(event: FormEvent<HTMLFormElement>) => submitHandler(event)}>
        <div className="p-4">
          <div className="flex justify-between">
            <div className={'font-semibold text-xl'}>
              Create companions
            </div>
            <div>
              <button type="submit" className={'btn-primary-small'}>Submit</button>
            </div>
          </div>
        </div>
        <div className={'p-2'}>
          {nameValues.map((value, index) => (
            <div key={index} className={'shah-card mb-4'}>
              <div className={'mb-2 px-1 flex justify-between items-center'}>
                <div className="flex items-center">

                  {index > 0 &&
                    <div className={'relative'}>
                      <button data-dropdown-toggle="dropdownDots" className="btn-icon-primary" type="button"
                              onClick={() => toggleMenu(index)}>
                        <IconThreeDotsVertical/>
                      </button>
                      {value.showDropDown &&
                        <div
                          className="absolute transition ease-in-out bottom-0 left-8 - z-10 mt-2 w-28 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                          <div className="py-1" role="none">
                            <a onClick={() => removeNameFields(index)} className="text-gray-700 block px-4 py-2 text-sm"
                               role="menuitem" tabIndex={-1} id="menu-item-0">
                              Ta bort gäst
                            </a>
                          </div>
                        </div>
                      }
                    </div>
                  }
                  <div className="font-semibold text-gray-600">Gäst</div>
                  <div className="inline-flex items-center justify-center w-5 h-5 ml-2 text-xs text-blue-800 bg-blue-50 rounded-full">
                    {index + 1}
                  </div>
                </div>
              </div>
              <div className={'flex items-center'}>
                <div className={'px-1 w-1/2'}>
                  <input
                    type="text"
                    value={value.firstName}
                    onChange={(e) => nameInputHandler(index, 'firstName', e.target.value)}
                    className="input-primaty"
                    placeholder={`First name`}
                    required
                  />
                </div>
                <div className={'px-1 w-1/2'}>
                  <input
                    type="text"
                    value={value.lastName}
                    onChange={(e) => nameInputHandler(index, 'lastName', e.target.value)}
                    className="input-primaty"
                    placeholder={`Last name`}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
          <div className={'text-center flex justify-center'}>
            <button className={'btn-link flex items-center '} type="button" onClick={addNameFields}>
              <div>
                Add Guest
              </div>
              <div>
                <IconPlus/>
              </div>
            </button>
          </div>
          {/*<div className={'mt-6'}>*/}
          {/*  <button className={'btn-primary-small w-full'}>Skicka in</button>*/}
          {/*</div>*/}
        </div>
      </form>
    </>
  )
}
export default AddGuest;