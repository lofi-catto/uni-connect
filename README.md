# ENV
- Production: https://uni-connect-zeta.vercel.app/
- Staging: https://staging-uni-connect-zeta.vercel.app/
- Run locally: npm start
- Run test: npm test

# FEATURES DONE

- Joining chat room
- Multiple users joining in chat room
- Create new rooms
- Handle multiple user with the same name
- Group consecutive messages
- Is typing feature
- Current chat room works on reload
- Search feature (partially)
- CI/CD using Vercel

# FIRESTORE SCHEMA

- chatRooms

  - chatRoomId: string
  - name: string
  - roomCode: string
  - typingUsers: userId[]

- messages

  - messageId: string
  - chatRoom: Reference
  - sender: Reference
  - text: string
  - timestamp: timestamp
  - words: string[]

- users
  - userId: string
  - displayName: string

# KNOW ISSUES - REVIST IN FUTURE VERSIONS

1. There is no login, login will make things more secured and users can resume their sessions.
2. Should allow user to change their auto generated names
3. Same case for chat room code
4. More tests needed
5. Sass needs some tidying (could switch to css modules or styled components)
6. Search is not working well, firebase doesn't support text search, array storing is just a trick
7. Responsive for side bar could be better
