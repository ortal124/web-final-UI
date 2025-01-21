import { GoogleOAuthProvider } from '@react-oauth/google';
import './App.css'

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <GoogleOAuthProvider
    clientId='34674964625-qi6of44fa4cm2jpfhtgd9tlu5f0ib370.apps.googleusercontent.com'>
    <AuthProvider>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>    
    </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;