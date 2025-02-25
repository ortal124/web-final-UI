import { GoogleOAuthProvider } from '@react-oauth/google';

import RegistrationForm from './RegistrationForm';

function App() {
  return (
    <GoogleOAuthProvider
    clientId='34674964625-qi6of44fa4cm2jpfhtgd9tlu5f0ib370.apps.googleusercontent.com'>
      <div>
        <RegistrationForm />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;