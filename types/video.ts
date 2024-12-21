import { Models } from "react-native-appwrite"

import { User } from "@/types"

export type Video = Models.Document & {
  title: string
  thumbnail: string
  prompt: string
  video: string
  creator: User
}
