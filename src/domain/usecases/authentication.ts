import { AccountModel } from '../models/account-model'

type AuthenticationParams = {
  name: string
  email: string
  password: string
};

export interface Authentication {
  auth(params: AuthenticationParams): Promise<AccountModel>
}
