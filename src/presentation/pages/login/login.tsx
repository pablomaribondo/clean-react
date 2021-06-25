import React, { useState } from 'react'

import Styles from './login-styles.scss'
import {
  Footer,
  Input,
  LoginHeader as Header,
  FormStatus
} from '@/presentation/components'
import Context from '@/presentation/contexts/form/form-context'

type FormStateProps = {
  isLoading: boolean
  errorMessage: string
};

const Login: React.FC = () => {
  const [formState] = useState<FormStateProps>({
    isLoading: false,
    errorMessage: ''
  })

  return (
    <div className={Styles.login}>
      <Header />
      <Context.Provider value={formState}>
        <form className={Styles.form}>
          <h2>Login</h2>
          <Input type="email" name="email" placeholder="Digite seu e-mail" />
          <Input
            type="password"
            name="password"
            placeholder="Digite sua senha"
          />
          <button data-testid="submit" className={Styles.submit} type="submit" disabled>
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
