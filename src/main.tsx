import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoaderProvider  } from '@/contexts/LoaderContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement  
);

root.render(
  <LoaderProvider>
    <App />
  </LoaderProvider>,
);
