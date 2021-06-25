import React from 'react'
import { render, screen } from '@testing-library/react'

import Login from './login'

describe('Login component', () => {
  test('Should start with initial state', () => {
    render(<Login />)

    const errorWrapper = screen.getByTestId('error-wrapper')
    expect(errorWrapper.childElementCount).toBe(0)

    const submitButton = screen.getByTestId('submit') as HTMLButtonElement
    expect(submitButton.disabled).toBe(true)
  })
})
