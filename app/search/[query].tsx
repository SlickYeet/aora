import { useLocalSearchParams } from "expo-router"
import { useEffect } from "react"
import { FlatList, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { EmptyState } from "@/components/empty-state"
import { SearchInput } from "@/components/search-input"
import { VideoCard } from "@/components/video-card"
import { useAppwrite } from "@/hooks/use-appwrite"
import { searchVideos } from "@/lib/appwrite"

export default function Search() {
  const { query } = useLocalSearchParams()

  const { videos, refetch } = useAppwrite(() => searchVideos(query as string))

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="h-full bg-primary">
      <FlatList
        data={videos}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-gray-100">
              Search results for
            </Text>
            <Text className="font-psemibold text-2xl text-white">{query}</Text>

            <View className="mb-8 mt-6">
              <SearchInput initialQuery={query as string} />
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
