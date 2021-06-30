import React, { useState, useEffect, FormEvent } from 'react'

import Styles from './login-styles.scss'
import {
  Footer,
  Input,
  LoginHeader as Header,
  FormStatus
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'
import { Authentication } from '@/domain/usecases'

type Props = {
  validation: Validation
  authentication: Authentication
};

const Login: React.FC<Props> = ({ validation, authentication }: Props) => {
  const [formState, setFormState] = useState({
    isLoading: false,
    mainError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: ''
  })

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      emailError: validation.validate('email', formState.email)
    }))
  }, [formState.email])

  useEffect(() => {
    setFormState((prevState) => ({
      ...prevState,
      passwordError: validation.validate('password', formState.password)
    }))
  }, [formState.password])

  const submitHandler = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault()

    setFormState((prevState) => ({ ...prevState, isLoading: true }))
    await authentication.auth({
      email: formState.email,
      password: formState.password
    })
  }

  return (
    <div className={Styles.login}>
      <Header />
      <Context.Provider value={{ formState, setFormState }}>
        <form className={Styles.form} onSubmit={submitHandler}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <button
            data-testid="submit"
            className={Styles.submit}
            type="submit"
            disabled={!!formState.emailError || !!formState.passwordError}
          >
            Entrar
          </button>
          <span className={Styles.link}>Criar conta</span>
          <FormStatus />
        </form>
      </Context.Provider>
      <Footer />
    </div>
  )
}

export default Login
