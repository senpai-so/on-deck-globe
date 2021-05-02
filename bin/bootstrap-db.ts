/* eslint-disable import/first */

// npx ts-node -O '{"module":"commonjs"}' bin/bootstrap-db.ts

import dotenv from 'dotenv-safe'
dotenv.config()

import social from '../data/social.json'
import * as db from '../lib/db'
import { User } from '../lib/types'

async function main() {
  const { docs } = await db.listUserDocs()

  const u = Object.values(social) as Partial<User>[]
  const socials = u.filter((u) => u.twitterBio)

  for (const s of socials) {
    for (let i = 0; i < docs.length; ++i) {
      const doc = docs[i]
      const data = doc.data()

      if (data.userId === s.id) {
        const d = await db.users.doc(doc.id)
        console.log(doc.id, data, s.twitterBio)

        await d.update({
          twitterBio: s.twitterBio
        })

        break
      }
    }
  }

  // const users = await getUsers()
  // console.log('users', users)
}

main().catch((err) => {
  console.error(err)
})
