import { User } from './types'

import mockUsers from './mock-users'

export const getUsers = async (): Promise<User[]> => {
  return mockUsers.filter((user) => {
    // ensure that we don't leak private user data if fellows haven't opted in
    if (!user.isPublic) {
      return {
        ...user,
        fellow: null
      }
    } else {
      return user
    }
  })
}
