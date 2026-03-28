import { createBrowserRouter } from "react-router-dom";
import ParenLayout from "../layout/ParenLayout";
import HomePage from "../PublicPage/Home/HomePage";

export const router = createBrowserRouter([{
    path:'/',
    element:<ParenLayout/>,
    children:([
        {
            path:'/',
            element:<HomePage/>
        }
    ])
},

])