import {
  launchImageLibraryAsync,
  type ImagePickerAsset,
} from "expo-image-picker"
import { router } from "expo-router"
import { useVideoPlayer, VideoView } from "expo-video"
import { useState } from "react"
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { CustomButton } from "@/components/CustomButton"
import { FormField } from "@/components/form-field"
import { icons } from "@/constants"
import { useGlobalContext } from "@/context/global-provider"
import { createVideo } from "@/lib/appwrite"
import { Media } from "@/types"

export default function Create() {
  const [form, setForm] = useState<{
    title: string
    video: ImagePickerAsset | null
    thumbnail: ImagePickerAsset | null
    prompt: string
  }>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  })
  const [uploading, setUploading] = useState<boolean>(false)

  const player = useVideoPlayer(form.video?.uri ?? "")

  const { user } = useGlobalContext()
  if (!user) {
    router.push("/sign-in")
    return null
  }

  const openPicker = async (selectType: Media) => {
    const result = await launchImageLibraryAsync({
      mediaTypes: selectType === "image" ? "images" : "videos",
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] })
      }

      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] })
      }
    }
  }

  const submit = async () => {
    const { title, prompt, video, thumbnail } = form
    if (!title || !prompt || !video || !thumbnail) {
      return Alert.alert("Please fill all fields")
    }

    setUploading(true)
    try {
      await createVideo({
        title,
        video,
        thumbnail,
        prompt,
        userId: user.$id,
      })

      Alert.alert("Success", "Video uploaded successfully")
      router.push("/home")
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      })
      setUploading(false)
    }
  }

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView className="my-6 px-4">
        <Text className="font-psemibold text-2xl text-white">Upload Video</Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          className="mt-10"
        />

        <View className="mt-7">
          <Text className="mb-2 font-pmedium text-base text-gray-100">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <View className="h-64 w-full rounded-2xl">
                <VideoView
                  player={player}
                  allowsPictureInPicture={false}
                  nativeControls
                  style={{ height: "100%", width: "100%", borderRadius: 16 }}
                />
              </View>
            ) : (
              <View className="h-40 w-full items-center justify-center rounded-2xl bg-black-100 px-4">
                <View className="h-14 w-14 items-center justify-center border border-dashed border-secondary-100">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="h-1/2 w-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7">
          <Text className="mb-2 font-pmedium text-base text-gray-100">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="contain"
                className="h-64 w-full rounded-2xl"
              />
            ) : (
              <View className="h-16 w-full flex-row items-center justify-center rounded-2xl border-2 border-black-200 bg-black-100 px-4">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="mr-2 h-5 w-5"
                />
                <Text className="font-pmedium text-sm text-gray-100">
                  Choose a thumbnail
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="The prompts you used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          className="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          isLoading={uploading}
          handlePress={submit}
          className="mt-7"
        />
      </ScrollView>
    </SafeAreaView>
  )
}
