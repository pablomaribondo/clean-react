import React, { useState, useEffect } from 'react'

import Styles from './login-styles.scss'
import {
  Footer,
  Input,
  LoginHeader as Header,
  FormStatus
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'
import { Validation } from '@/presentation/protocols/validation'

type Props = {
  validation: Validation
};

const Login: React.FC<Props> = ({ validation }: Props) => {
  const [formState, setFormState] = useState({
    isLoading: false,
    mainError: '',
    email: '',
    emailError: 'Campo obrigatório',
    password: '',
    passwordError: 'Campo obrigatório'
  })

  useEffect(() => {
    validation.validate('email', formState.email)
  }, [formState.email])

  useEffect(() => {
    validation.validate('password', formState.password)
  }, [formState.password])

  return (
    <div className={Styles.login}>
      <Header />
      <Context.Provider value={{ formState, setFormState }}>
        <form className={Styles.form}>
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
            disabled
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
