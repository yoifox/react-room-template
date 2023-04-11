import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Template from './Template';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        {/* Preload assets */}
        <img src="/scene/notes_bg.png" height="100%" style={{ display: "none" }}></img>
        <img src="/scene/notes_static.png" height="100%" style={{ display: "none" }}></img>
        <img src="/scene/tv_bg.png" height="100%" style={{ display: "none" }}></img>
        <img src="/scene/tv_static.png" height="100%" style={{ display: "none" }}></img>
        <img src="/scene/tv_static_1.png" height="100%" style={{ display: "none" }}></img>
        <Template />
    </React.StrictMode>
);
