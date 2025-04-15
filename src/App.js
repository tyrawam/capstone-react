import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './css/App.css';

// Routes
import RootLayout from './routes/Root';
import HomePage from './routes/Home';
import EventsPage from './routes/Events';
import EventDetailPage from './routes/EventDetail';
import EventFormPage from './routes/EventForm';
import AccountPage from './routes/Account';
import ErrorPage from './routes/Error';
import LoginPage from './routes/Login';
import RegisterPage from './routes/Register';

import ProtectedRoutes from './utils/ProtectedRoutes';
import { AuthProvider } from './utils/AuthContext';

// Router to handle links to different pages
// routes wrapped under RootLayout to enable rendering navbar on each individual page
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,     
    errorElement: <ErrorPage />,
    children: [
        // index used to make this page default when parent route active
          { path: 'login', element: <LoginPage />},
          { path: 'register', element: <RegisterPage />},
          { path: '/', 
            element: <ProtectedRoutes />, 
            children: [
              { index: true, element: <HomePage /> },
              { path: 'account', element: <AccountPage /> },
              { path: 'events', element: <EventsPage /> },
              { path: 'events/form', element: <EventFormPage /> },
              { path: 'events/:eventID', element: <EventDetailPage /> }
          ]}
      ]
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router = { router } />
    </AuthProvider>
  )
}

export default App;