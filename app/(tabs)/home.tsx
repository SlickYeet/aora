import { useState } from "react"
import { FlatList, Image, RefreshControl, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { EmptyState } from "@/components/empty-state"
import { Latest } from "@/components/latest"
import { SearchInput } from "@/components/search-input"
import { VideoCard } from "@/components/video-card"
import { images } from "@/constants"
import { useGlobalContext } from "@/context/global-provider"
import { useAppwrite } from "@/hooks/use-appwrite"
import { getAllVideos, getLatestVideos } from "@/lib/appwrite"

export default function Home() {
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false)

  const { user } = useGlobalContext()

  const { videos, refetch } = useAppwrite(getAllVideos)
  const { videos: latestVideos, refetch: refetchLatestVideos } =
    useAppwrite(getLatestVideos)

  const onRefresh = async () => {
    setIsRefreshing(true)
    await refetch()
    await refetchLatestVideos()
    setIsRefreshing(false)
  }

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={videos}
        ListHeaderComponent={() => (
          <View className="my-6 space-y-6 px-4">
            <View className="mb-6 flex-row items-start justify-between">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back,
                </Text>
                <Text className="font-psemibold text-2xl text-white">
                  {user?.username ?? "User"}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  resizeMode="contain"
                  className="h-10 w-9"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pb-8 pt-5">
              <Text className="mb-3 font-pregular text-lg text-gray-100">
                Latest Videos
              </Text>

              <Latest videos={latestVideos} />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            subtitle="Be the first to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  )
}
