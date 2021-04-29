import { User } from './types'

import mockUsers from './mock-users'

export const getUsers = async (): Promise<User[]> => {
  return mockUsers
}
