import {useState} from "react";
import TopNavigationMenu from "../../components/TopNavigationMenu.tsx";
import {useDispatch} from "react-redux";
import {addGuest} from "../../store/event.ts";
import {AppDispatch} from "../../store";
import {IconPlus, IconThreeDotsVertical} from "../../components/Icons.tsx";

interface AddGuestResponse {
  meta: {
    requestStatus: string;
  };
}

const AdminRootLayout = () => {

  const dispatch = useDispatch<AppDispatch>();
  const [nameValues, setNameValues] = useState<{ firstName: string, lastName: string, showDropDown: boolean }[]>([
    {firstName: '', lastName: '', showDropDown: false}
  ]);

  const addEventHandler = () : void => {
    dispatch(addGuest(nameValues)).then((res: AddGuestResponse) => {
      if (res.meta.requestStatus === "fulfilled") {
        setNameValues([{firstName: '', lastName: '', showDropDown: false}])
      }
    })
  }

  type FieldName = 'firstName' | 'lastName';
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
      <TopNavigationMenu showBackButton={false} title={'Add companion'}>
        <button onClick={() => addEventHandler()} className={'btn-primary-small'}>Klar</button>
      </TopNavigationMenu>
      <div className={'p-2'}>
        {nameValues.map((value, index) => (
          <div key={index} className={'shah-card mb-4'}>
            <div className={'mb-2 px-1 flex justify-between items-center'}>
              <div>
                Gäst #{index + 1}
              </div>
              {index > 0 &&
                <div className={'relative'}>
                  <button data-dropdown-toggle="dropdownDots" className="btn-icon-primary" type="button"
                          onClick={() => toggleMenu(index)}>
                    <IconThreeDotsVertical/>
                  </button>
                  {value.showDropDown &&
                    <div
                      className="absolute bottom-0 right-9 z-10 mt-2 w-28 origin-bottom-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
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
        <button className={'btn-primary-small m-2 flex items-center'} type="button" onClick={addNameFields}>
          <div className={'mr-2'}>
            <IconPlus/>
          </div>
          <div>
            Lägg till gäst
          </div>
        </button>
      </div>
    </>
  )
}
export default AdminRootLayout;