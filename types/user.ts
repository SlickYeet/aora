import { Models } from "react-native-appwrite"

export type User = Models.Document & {
  username: string
  email: string
  avatar: string
  accountId: string
}
