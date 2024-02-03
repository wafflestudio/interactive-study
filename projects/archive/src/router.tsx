import { createBrowserRouter } from 'react-router-dom';

import About from './pages/about';
import DefaultLayout from './pages/layout';
import Works from './pages/works';

const router = createBrowserRouter(
  [
    {
      path: '',
      element: <DefaultLayout />,
      children: [
        {
          path: '',
          element: <Works />,
          index: true,
        },
        {
          path: 'works',
          element: <Works />,
        },
        {
          path: 'about',
          element: <About />,
        },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);

export default router;
