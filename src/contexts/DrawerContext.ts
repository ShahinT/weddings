import {createContext, Dispatch, SetStateAction} from "react";

interface SideDrawerContextProps {
  setIsDrawerOpen: Dispatch<SetStateAction<boolean>>;
  isDrawerOpen: boolean
}

export const DrawerContext = createContext<SideDrawerContextProps>({
  isDrawerOpen: true,
  setIsDrawerOpen: () => {}
});