import { User } from './types'
import * as db from './db'
import mockUsers from './mock-users'

const useRealData = true
const isDemoMode = false

export const getUsers = async (): Promise<User[]> => {
  let users: User[] = mockUsers

  if (useRealData) {
    console.time('listUsers db.users.where')
    const { docs } = await db.listUserDocs()
    console.timeEnd('listUsers db.users.where')
    users = docs.map((doc) => db.getSnapshot<User>(doc))
  }

  users = users.map((user) => {
    if (isDemoMode) {
      return {
        ...user,
        isPublic: true
      }
    }

    // ensure that we don't leak private user data if fellows haven't opted in
    if (!user.isPublic) {
      return {
        ...user,
        fellow: null,
        twitterBio: null
      }
    } else {
      return {
        ...user,
        fellow: {
          id: user.fellow.id,
          name: user.fellow.name,
          imageUrl: user.fellow.imageUrl,
          twitterId: user.fellow.twitterId,
          linkedinId: user.fellow.linkedinId,
          personalUrl: user.fellow.personalUrl
        }
      }
    }
  })

  // ensure that the public users are at the end, so they're drawn on top
  users.sort(
    (a, b) =>
      ((a.isPublic as unknown) as number) - ((b.isPublic as unknown) as number)
  )
  const tId = '4391'
  const t = users.find((u) => u.userId === tId)
  users = users.filter((u) => u.userId !== tId)
  users = users.concat(t ? [t] : [])

  return users
}
