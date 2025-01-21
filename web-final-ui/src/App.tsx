import './App.css'

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>    
    </AuthProvider>
  );
}

export default App;