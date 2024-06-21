import '@testing-library/jest-dom';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {Event} from '../interfaces'
import {BrowserRouter as Router} from "react-router-dom";
import {Provider} from "react-redux";
import AdminLandingPage from "../pages/Admin/AdminLandingPage.tsx";
import {configureStore} from "@reduxjs/toolkit";
import eventReducer from '../store/event';
const mockedEvents: Event[] = [
  { id: '1', name: 'Event 1', groom: 'John', bride: 'Jane', startTime: '2024-01-01', address: '123 Street', userId:'123' },
  { id: '2', name: 'Event 2', groom: 'Mike', bride: 'Anna', startTime: '2024-02-01', address: '456 Avenue', userId:'456' }
];
const mockStore = configureStore({
  reducer: {
    event: eventReducer,
  },
});
const MockAdminLandingPage = () => (
  <Provider store={mockStore}>
    <Router>
      <AdminLandingPage />
    </Router>
  </Provider>
);

describe("Admin Landing Page", (): void => {
  beforeEach((): void => {
    mockStore.dispatch({ type: 'event/setAdminEvents/fulfilled', payload: mockedEvents });
  });

  it('renders without crashing', (): void => {
    render(<MockAdminLandingPage />);
    expect(screen.getByText('Your events')).toBeInTheDocument();
  });

  it('displays events from the store', async (): Promise<void> => {
    render(<MockAdminLandingPage />);
    await waitFor((): void => {
      mockedEvents.forEach((event: Event): void => {
        expect(screen.getByText(event.name)).toBeInTheDocument();
      });
    });
  });

  it('navigates to event details when an event is clicked', async (): Promise<void> => {
    render(<MockAdminLandingPage />);
    fireEvent.click(screen.getByText('Event 1'));
    // TODO: Verify navigation by mocking `useNavigate`
  });

  it('dispatches logout action and navigates to login on logout click', (): void => {
    render(<MockAdminLandingPage />);
    fireEvent.click(screen.getByText('Logout'));
    // TODO: Verify dispatch and logout action and navigation to login by mocking `useDispatch` and `useNavigate`
  });
})