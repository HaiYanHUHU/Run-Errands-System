import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);

const AppContainer = () => {
  return (
    <BrowserRouter basename={'/'}>
      <App />
    </BrowserRouter>
  );
};

root.render(<AppContainer />);

