import React from 'react';
import ReactDOM from 'react-dom/client';
import DashboardApp from './DashboardApp';
import '../index.css';
import '../i18n/config';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <DashboardApp />
    </React.StrictMode>,
);
