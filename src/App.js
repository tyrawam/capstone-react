import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

// Routes
import RootLayout from './routes/Root';
import HomePage from './routes/Home';
import EventsPage from './routes/Events';
import AccountPage from './routes/Account';

// Router to handle links to different pages
// routes wrapped under RootLayout to enable rendering navbar on each individual page
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
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
