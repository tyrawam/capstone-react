import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './css/App.css';

// Routes
import RootLayout from './routes/Root';
import HomePage from './routes/Home';
import EventsPage from './routes/Events';
import AccountPage from './routes/Account';
import ErrorPage from './routes/Error';
import LoginPage from './routes/Login';

// Router to handle links to different pages
// routes wrapped under RootLayout to enable rendering navbar on each individual page
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
        { path: 'login', element: <LoginPage />},
        { path: '/', element: <HomePage /> },
        { path: '/events', element: <EventsPage /> },
        { path: '/account', element: <AccountPage /> }
    ]
  },
]);

function App() {
  return <RouterProvider router = { router } />
}

export default App;