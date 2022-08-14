import React, { useImperativeHandle, useState } from 'react'
import Button from './Button'

const Togglable = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)
  const { buttonLabel, children } = props

  const hiddenWhenVisible = { display: visible ? 'none' : '' }
  const shownWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      <div style={hiddenWhenVisible}>
        <Button text={buttonLabel} onClick={toggleVisibility} />
      </div>
      <div style={shownWhenVisible}>
        {children}
        <Button text="cancel" onClick={toggleVisibility} />
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable