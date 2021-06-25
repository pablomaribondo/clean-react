import React, { useContext } from 'react'

import Styles from './form-status-styles.scss'
import Spinner from '@/presentation/components/spinner/spinner'
import Context from '@/presentation/contexts/form/form-context'

const FormStatus: React.FC = () => {
  const {
    formState: { isLoading }, errorState: { main }
  } = useContext(Context)

  return (
    <div className={Styles.errorWrapper} data-testid="error-wrapper">
      {isLoading && <Spinner className={Styles.spinner} />}
      {main && <span className={Styles.error}>{main}</span>}
    </div>
  )
}

export default FormStatus
