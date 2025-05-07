import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux"; 
import { store } from '@/store';
import '@/App.scss';

// components
import LoginView from '@/modules/login/views/LoginView';
import SearchView from '@/modules/c360/views/SearchView';
import InformationView from '@/views/Navbar';
import Loader from '@/components/loader/Loader';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<LoginView />} />
            <Route path="/search" element={<SearchView />} />
            <Route path="/information" element={<InformationView />} />
            <Route path="/c360" element={<InformationView defaultTab="c360" />} />
          </Routes>
        </Router>
      </Provider>

      <Loader />
    </div>
  );
}

export default App;
