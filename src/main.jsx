import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/App.css'; // Global styles
import App from './App.jsx';

const root = createRoot(document.getElementById('root'));
root.render(
    <App />
);