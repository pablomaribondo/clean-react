import React from 'react'
import { render, RenderResult, fireEvent } from '@testing-library/react'
import faker from 'faker'

import Login from './login'
import { ValidationSpy } from '@/presentation/test'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
};

const makeSut = (): SutTypes => {
  const validationSpy = new ValidationSpy()
  const errorMessage = faker.random.words()
  validationSpy.errorMessage = errorMessage
  const sut = render(<Login validation={validationSpy} />)

  return { sut, validationSpy }
}

describe('Login component', () => {
  test('Should start with initial state', () => {
    const { sut, validationSpy } = makeSut()

    const errorWrapper = sut.getByTestId('error-wrapper')

    expect(errorWrapper.childElementCount).toBe(0)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement

    expect(submitButton.disabled).toBe(true)

    const emailStatus = sut.getByTestId('email-status')

    expect(emailStatus.title).toBe(validationSpy.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')

    const passwordStatus = sut.getByTestId('password-status')

    expect(passwordStatus.title).toBe(validationSpy.errorMessage)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should call Validation with correct email', () => {
    const { sut, validationSpy } = makeSut()

    const emailInput = sut.getByTestId('email')
    const email = faker.internet.email()

    fireEvent.input(emailInput, { target: { value: email } })

    expect(validationSpy.fieldName).toBe('email')
    expect(validationSpy.fieldValue).toBe(email)
  })

  test('Should call Validation with correct password', () => {
    const { sut, validationSpy } = makeSut()

    const passwordInput = sut.getByTestId('password')
    const password = faker.internet.password()

    fireEvent.input(passwordInput, { target: { value: password } })

    expect(validationSpy.fieldName).toBe('password')
    expect(validationSpy.fieldValue).toBe(password)
  })

  test('Should show email error if Validation fails', () => {
    const { sut, validationSpy } = makeSut()

    const emailInput = sut.getByTestId('email')
    const emailStatus = sut.getByTestId('email-status')
    const email = faker.internet.email()

    fireEvent.input(emailInput, { target: { value: email } })

    expect(emailStatus.title).toBe(validationSpy.errorMessage)
    expect(emailStatus.textContent).toBe('🔴')
  })

  test('Should show password error if Validation fails', () => {
    const { sut, validationSpy } = makeSut()

    const passwordInput = sut.getByTestId('password')
    const passwordStatus = sut.getByTestId('password-status')
    const password = faker.internet.password()

    fireEvent.input(passwordInput, { target: { value: password } })

    expect(passwordStatus.title).toBe(validationSpy.errorMessage)
    expect(passwordStatus.textContent).toBe('🔴')
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.errorMessage = null

    const emailInput = sut.getByTestId('email')
    const emailStatus = sut.getByTestId('email-status')
    const email = faker.internet.email()

    fireEvent.input(emailInput, { target: { value: email } })

    expect(emailStatus.title).toBe('Tudo certo!')
    expect(emailStatus.textContent).toBe('🟢')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { sut, validationSpy } = makeSut()
    validationSpy.errorMessage = null

    const passwordInput = sut.getByTestId('password')
    const passwordStatus = sut.getByTestId('password-status')
    const password = faker.internet.password()

    fireEvent.input(passwordInput, { target: { value: password } })

    expect(passwordStatus.title).toBe('Tudo certo!')
    expect(passwordStatus.textContent).toBe('🟢')
  })
})
