import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  ImageGravity,
  Query,
  Storage,
} from "react-native-appwrite"

import type { Media, User } from "@/types"
import { ImagePickerAsset } from "expo-image-picker"

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "ca.famlam.aora",
  projectId: "675dffca0035f67d3755",
  databaseId: "676533a20004db13b582",
  userCollectionId: "676533b90037cdee8a17",
  videoCollectionId: "676533d00000e1e9c3ed",
  storageId: "676348f0003cf14969a7",
}

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  userCollectionId,
  videoCollectionId,
  storageId,
} = config

const client = new Client()

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform)

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export async function createUser(
  email: string,
  password: string,
  username: string,
) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username,
    )
    if (!newAccount) throw new Error()

    const avatarUrl = avatars.getInitials(username)

    await signIn(email, password)

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      },
    )

    return newUser as User
  } catch (error: any) {
    console.log(error.message)
    throw new Error(error.message)
  }
}

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password)
    return session
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current")
    return session
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get()
    if (!currentAccount) throw new Error()

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)],
    )
    if (!currentUser) throw new Error()

    return currentUser.documents[0] as User
  } catch (error: any) {
    console.log(error.message)
  }
}

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export async function getAllVideos() {
  try {
    const videos = await databases.listDocuments(databaseId, videoCollectionId)
    return shuffleArray(videos.documents)
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getLatestVideos() {
  try {
    const videos = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)],
    )
    return videos.documents
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function searchVideos(query: string) {
  try {
    const videos = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.search("title", query)],
    )
    return videos.documents
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getUserPosts(userId: string) {
  try {
    const videos = await databases.listDocuments(
      databaseId,
      videoCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")],
    )
    return videos.documents
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function getFilePreview(fileId: string, type: Media) {
  let fileUrl = null

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId)
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100,
      )
    } else {
      throw new Error("Invalid file type")
    }

    if (!fileUrl) throw new Error()

    return fileUrl
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function uploadFile(file: ImagePickerAsset, type: Media) {
  if (!file) return

  const { mimeType, fileName, fileSize, uri } = file
  if (!mimeType || !fileName || !fileSize || !uri) {
    throw new Error("Invalid file metadata")
  }
  const asset = { name: fileName, type: mimeType, size: fileSize, uri }

  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), asset)

    const fileUrl = await getFilePreview(uploadedFile.$id, type)

    return fileUrl
  } catch (error: any) {
    throw new Error(error.message)
  }
}

export async function createVideo(form: {
  title: string
  video: ImagePickerAsset
  thumbnail: ImagePickerAsset
  prompt: string
  userId: string
}) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ])

    const newVideo = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: form.title,
        video: videoUrl,
        thumbnail: thumbnailUrl,
        prompt: form.prompt,
        creator: form.userId,
      },
    )

    return newVideo
  } catch (error: any) {
    throw new Error(error.message)
  }
}
