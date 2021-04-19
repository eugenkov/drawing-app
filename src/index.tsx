import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {CanvasProvider} from './CanvasContext';
import {store} from './store';
import './index.css';
import App from './App';

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <CanvasProvider>
                <App />
            </CanvasProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
