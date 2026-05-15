import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import {  RouterProvider } from 'react-router-dom'
import { router } from './router/router.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SocketProvider } from './context/SocketProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <Provider store={store}>
     <SocketProvider>
       <RouterProvider router={router}></RouterProvider>
       <ToastContainer position="bottom-right" theme="light" autoClose={3000} />
     </SocketProvider>
   </Provider>
  </StrictMode>,
)
