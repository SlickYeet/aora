import { FlatList, Image, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"

import { EmptyState } from "@/components/empty-state"
import { InfoBox } from "@/components/info-box"
import { VideoCard } from "@/components/video-card"
import { icons } from "@/constants"
import { useGlobalContext } from "@/context/global-provider"
import { useAppwrite } from "@/hooks/use-appwrite"
import { getUserPosts, signOut } from "@/lib/appwrite"

export default function Profile() {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()
  if (!user) return null

  const { videos } = useAppwrite(() => getUserPosts(user.$id))

  const logout = async () => {
    await signOut()
    setUser(null)
    setIsLoggedIn(false)
    router.replace("/sign-in")
  }

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={videos}
        ListHeaderComponent={() => (
          <View className="mb-12 mt-6 w-full items-center justify-center px-4">
            <TouchableOpacity
              onPress={logout}
              className="mb-10 w-full items-end"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="h-6 w-6"
              />
            </TouchableOpacity>

            <View className="h-16 w-16 items-center justify-center rounded-lg border border-secondary">
              <Image
                source={{ uri: user.avatar }}
                resizeMode="cover"
                className="h-[90%] w-[90%] rounded-lg"
              />
            </View>

            <InfoBox
              title={user.username}
              titleClassName="text-lg"
              className="mt-5"
            />

            <View className="flex-row">
              <InfoBox
                title={videos.length || 0}
                subtitle="Videos"
                titleClassName="text-xl"
                className="mr-10"
              />
              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleClassName="text-xl"
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="No videos found for the search query"
          />
        )}
      />
    </SafeAreaView>
  )
}
