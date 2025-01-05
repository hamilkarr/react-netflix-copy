import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import Home from './routes/Home';
import Tv from './routes/Tv';
import Search from './routes/Search';
import Header from './components/Header';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/movies/:id",
        element: <Home />
      },
      {
        path: "/tv",
        element: <Tv />
      },
      {
        path: "/search",
        element: <Search />
      },
    ]
  }
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
