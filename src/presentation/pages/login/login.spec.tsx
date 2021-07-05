import React from 'react'
import faker from 'faker'
import {
  render,
  RenderResult,
  fireEvent,
  waitFor
} from '@testing-library/react'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import 'jest-localstorage-mock'

import Login from './login'
import { ValidationSpy, AuthenticationSpy } from '@/presentation/test'
import { InvalidCredentialsError } from '@/domain/errors'

type SutTypes = {
  sut: RenderResult
  validationSpy: ValidationSpy
  authenticationSpy: AuthenticationSpy
};

type SutParams = {
  validationError: string
};

const history = createMemoryHistory()

const makeSut = (params?: SutParams): SutTypes => {
  const validationSpy = new ValidationSpy()
  const authenticationSpy = new AuthenticationSpy()
  validationSpy.errorMessage = params?.validationError

  const sut = render(
    <Router history={history}>
      <Login validation={validationSpy} authentication={authenticationSpy} />
    </Router>
  )

  return { sut, validationSpy, authenticationSpy }
}

const simulateValidSubmit = (
  sut: RenderResult,
  email?: string,
  password?: string
): void => {
  populateEmailField(sut, email)
  populatePasswordField(sut, password)
  const submitButton = sut.getByTestId('submit')

  fireEvent.click(submitButton)
}

const populateEmailField = (
  sut: RenderResult,
  email = faker.internet.email()
): void => {
  const emailInput = sut.getByTestId('email')

  fireEvent.input(emailInput, { target: { value: email } })
}

const populatePasswordField = (
  sut: RenderResult,
  password = faker.internet.password()
): void => {
  const passwordInput = sut.getByTestId('password')

  fireEvent.input(passwordInput, { target: { value: password } })
}

const simulateStatusForField = (
  sut: RenderResult,
  fieldName: string,
  validationError?: string
): void => {
  const status = sut.getByTestId(`${fieldName}-status`)

  expect(status.title).toBe(validationError || 'Tudo certo!')
  expect(status.textContent).toBe(validationError ? '🔴' : '🟢')
}

describe('Login component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('Should start with initial state', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    const errorWrapper = sut.getByTestId('error-wrapper')

    expect(errorWrapper.childElementCount).toBe(0)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement

    expect(submitButton.disabled).toBe(true)

    simulateStatusForField(sut, 'email', validationError)
    simulateStatusForField(sut, 'password', validationError)
  })

  test('Should call Validation with correct email', () => {
    const { sut, validationSpy } = makeSut()

    const email = faker.internet.email()
    populateEmailField(sut, email)

    expect(validationSpy.fieldName).toBe('email')
    expect(validationSpy.fieldValue).toBe(email)
  })

  test('Should call Validation with correct password', () => {
    const { sut, validationSpy } = makeSut()

    const password = faker.internet.password()
    populatePasswordField(sut, password)

    expect(validationSpy.fieldName).toBe('password')
    expect(validationSpy.fieldValue).toBe(password)
  })

  test('Should show email error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    populateEmailField(sut)

    simulateStatusForField(sut, 'email', validationError)
  })

  test('Should show password error if Validation fails', () => {
    const validationError = faker.random.words()
    const { sut } = makeSut({ validationError })

    populatePasswordField(sut)

    simulateStatusForField(sut, 'password', validationError)
  })

  test('Should show valid email state if Validation succeeds', () => {
    const { sut } = makeSut()

    populateEmailField(sut)

    simulateStatusForField(sut, 'email')
  })

  test('Should show valid password state if Validation succeeds', () => {
    const { sut } = makeSut()

    populatePasswordField(sut)

    simulateStatusForField(sut, 'password')
  })

  test('Should enable submit button if form is valid', () => {
    const { sut } = makeSut()

    populateEmailField(sut)
    populatePasswordField(sut)

    const submitButton = sut.getByTestId('submit') as HTMLButtonElement

    expect(submitButton.disabled).toBe(false)
  })

  test('Should show spinner on submit', () => {
    const { sut } = makeSut()

    simulateValidSubmit(sut)

    const spinner = sut.getByTestId('spinner')

    expect(spinner).toBeTruthy()
  })

  test('Should call Authentication with correct values', () => {
    const { sut, authenticationSpy } = makeSut()

    const email = faker.internet.email()
    const password = faker.internet.password()

    simulateValidSubmit(sut, email, password)

    expect(authenticationSpy.params).toEqual({
      email,
      password
    })
  })

  test('Should call Authentication only once', () => {
    const { sut, authenticationSpy } = makeSut()

    simulateValidSubmit(sut)
    simulateValidSubmit(sut)

    expect(authenticationSpy.callsCount).toBe(1)
  })

  test('Should not call Authentication if form is invalid', () => {
    const validationError = faker.random.words()
    const { sut, authenticationSpy } = makeSut({ validationError })
    const form = sut.getByTestId('form')

    populateEmailField(sut)

    fireEvent.submit(form)

    expect(authenticationSpy.callsCount).toBe(0)
  })

  test('Should present error if Authentication fails', async () => {
    const { sut, authenticationSpy } = makeSut()
    const error = new InvalidCredentialsError()
    jest
      .spyOn(authenticationSpy, 'auth')
      .mockReturnValueOnce(Promise.reject(error))
    const errorWrapper = sut.getByTestId('error-wrapper')

    simulateValidSubmit(sut)

    await waitFor(() => errorWrapper)

    const mainError = sut.getByTestId('main-error')

    expect(mainError.textContent).toBe(error.message)
    expect(errorWrapper.childElementCount).toBe(1)
  })

  test('Should add accessToken to localstorage on success', async () => {
    const { sut, authenticationSpy } = makeSut()
    const form = sut.getByTestId('form')

    simulateValidSubmit(sut)

    await waitFor(() => form)

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'accessToken',
      authenticationSpy.account.accessToken
    )
  })

  test('Should go to signup page', () => {
    const { sut } = makeSut()
    const register = sut.getByTestId('signup')

    fireEvent.click(register)

    expect(history.length).toBe(2)
    expect(history.location.pathname).toBe('/signup')
  })
})
