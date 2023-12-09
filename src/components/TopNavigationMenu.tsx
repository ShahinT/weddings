import {useMatch, useNavigate} from "react-router-dom";
import {IconArrowLeft} from "./Icons.tsx";
import {FC, ReactNode} from "react";
interface TopNavigationMenu {
  showBackButton: boolean;
  title?: string,
  children?: ReactNode
}
  // element: ReactNode;
const TopNavigationMenu: FC<TopNavigationMenu> = ({showBackButton, title, children}) => {
  const navigate = useNavigate();
  const goBackHandler = () => {
    navigate(-1);
  }

  const isLandingPage = useMatch('/event/:eventId/:companionId')

  return (
    <div className="bg-gray-800 h-14 text-white px-4">
      {isLandingPage &&
        <div className={'flex-grow h-14 flex justify-center items-center'}>
          <div className={'mr-2'}>Sogand</div>
          <img alt="logo" src="https://flaticons.net/icon.php?slug_category=miscellaneous&slug_icon=wedding-ring" className="w-6" />
          <div className={'ml-2'}>Shahin</div>
        </div>
      }
      <div className={'flex h-14 justify-between items-center'}>
        <div className={'flex items-center'}>
          {showBackButton && (
            <button className="btn-icon" onClick={goBackHandler}>
              <IconArrowLeft/>
            </button>
          )}
          {title && <div className={'ml-4'}>{title}</div>}
        </div>
        <div>
          {children}
        </div>
      </div>
    </div>
  )
}
export default TopNavigationMenu;