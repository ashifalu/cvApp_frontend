import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './state/store.js'
import {GoogleOAuthProvider} from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Provider store={store}>
     <GoogleOAuthProvider clientId={"271628955977-tc9hhs196rnnc2jj0ka2qlkpunbm0rvs.apps.googleusercontent.com"}><App /></GoogleOAuthProvider>
    </Provider>
    </BrowserRouter>
)
