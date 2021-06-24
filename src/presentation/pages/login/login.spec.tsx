import React from 'react'
import { render, screen } from '@testing-library/react'

import Login from './login'

describe('Login component', () => {
  test('Should not render spinner and error on start', () => {
    render(<Login />)
    const errorWrapper = screen.getByTestId('error-wrapper')
    expect(errorWrapper.childElementCount).toBe(0)
  })
})
