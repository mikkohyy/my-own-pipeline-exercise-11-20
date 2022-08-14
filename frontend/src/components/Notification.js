import React from 'react'

const Notification = ({ successful, message }) => {
  if (message === null) {
    return null
  }

  const notificationStyle = {
    color: successful === true ? 'green' : 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 5,
    marginBottom: 10

  }

  return (
    <div className="notification-field" style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification