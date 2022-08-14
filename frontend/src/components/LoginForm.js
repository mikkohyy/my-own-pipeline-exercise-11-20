import React from 'react'

const LoginForm = ({ username, setUsername, password, setPassword, handleLogin }) => {
  return (
    <form id="login-form" onSubmit={handleLogin}>
      <div>
        username
        <input
          id="login-input-username"
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          id="login-input-password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <div>
        <button id="login-button" type="submit">login</button>
      </div>
    </form>
  )
}

export default LoginForm