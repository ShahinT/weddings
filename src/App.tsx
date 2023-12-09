import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Login from "./pages/Login.tsx";
import AppRootLayout from "./pages/AppRootLayout.tsx";
import ErrorPage from "./pages/ErrorPage.tsx";
import Home from "./pages/Home.tsx";
import EventRootLayout from "./pages/Event/EventRootLayout.tsx";
import EventLandingPage from "./pages/Event/LandingPage.tsx";
import EventGuestsList from "./pages/Event/GuestsList.tsx";
import EventGuestDetail from "./pages/Event/GuestDetail.tsx";
import RouteGuard from "./components/RouteGuard.tsx";
import AdminRootLayout from "./pages/Admin/AdminRootLayout.tsx";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    loggg?: (value: any) => void;
  }
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
window.loggg = (value: any) : void => {
  console.log(value);
};
function App() {

  // <ProtectedRoute isAuthenticated={isAuthenticated} component={AppRootLayout} />
  const router = createBrowserRouter([
    {
      path: '/',
      element: <AppRootLayout />,
      errorElement: <ErrorPage />,
      children: [
        { index: true, element: <Home />},
        {
          path: 'event/:eventId/:companionId',
          element: <EventRootLayout />,
          children:[
            { index: true, element: <EventLandingPage /> },
            { path: 'companion-guests-list', element: <EventGuestsList />},
            { path: 'guest-detail/:guestId', element: <EventGuestDetail />},
          ]
        },
      ]
    },
    {
      path: '/login',
      element: <RouteGuard isProtected={false} element={<Login />} />
    },
    {
      path: '/admin',
      element: <RouteGuard isProtected={true} element={<AdminRootLayout />} />
    }
  ])
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}



// LPU20L

export default App