import { User } from './types'
import * as db from './db'
import mockUsers from './mock-users'

const useRealData = false

export const getUsers = async (): Promise<User[]> => {
  let users: User[] = mockUsers

  if (useRealData) {
    console.time('listUsers db.users.where')
    const { docs } = await db.listUserDocs()
    console.timeEnd('listUsers db.users.where')
    users = docs.map((doc) => db.getSnapshot<User>(doc))
  }

  console.log(users)

  return users.map((user) => {
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
