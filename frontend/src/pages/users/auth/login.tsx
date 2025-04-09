import { useState } from 'react';
import { login } from '../../../utilities/django/allauth';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    const data = {
      username: username,
      password: password,
    };

    login(data)
      .then(response => {
        if (response.status === 200) {
          console.log('Login successful:', response.data);
          window.location.href = '/';
        } else {
          console.error('Login failed:', response.data);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  const handleLogin = () => {
    submit();
  };

  return (
    <div>
      <h1>Login Page</h1>
      <div>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default App;
