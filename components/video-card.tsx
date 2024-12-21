import { useVideoPlayer, VideoView } from "expo-video"
import { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View } from "react-native"

import { icons } from "@/constants"
import { Video } from "@/types"

interface VideoCardProps {
  video: Video
}

export function VideoCard({
  video: {
    title,
    thumbnail,
    video,
    creator: { username, avatar },
  },
}: VideoCardProps) {
  const [play, setPlay] = useState<boolean>(false)

  const player = useVideoPlayer(video, (player) => {
    player.loop = false
    player.addListener("playToEnd", () => {
      setPlay(false)
      player.currentTime = 0
    })
  })

  useEffect(() => {
    if (play) {
      player.play()
    } else {
      player.pause()
    }
  }, [play])

  return (
    <View className="mb-14 flex-col items-center px-4">
      <View className="flex-row items-start gap-3">
        <View className="flex-1 flex-row items-center justify-center">
          <View className="h-[46px] w-[46px] items-center justify-center rounded-lg border border-secondary p-0.5">
            <Image
              source={{ uri: avatar }}
              resizeMode="cover"
              className="h-full w-full rounded-lg"
            />
          </View>

          <View className="ml-3 flex-1 justify-center gap-y-1">
            <Text
              className="font-psemibold text-sm text-white"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className="font-pregular text-xs text-gray-100"
              numberOfLines={1}
            >
              {username}
            </Text>
          </View>
        </View>

        <View className="pt-2">
          <Image source={icons.menu} resizeMode="contain" className="h-5 w-5" />
        </View>
      </View>

      {play ? (
        <View className="mt-3 h-60 w-full rounded-xl">
          <VideoView
            player={player}
            allowsPictureInPicture={false}
            nativeControls
            style={{ height: "100%", width: "100%", borderRadius: 12 }}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setPlay(true)}
          activeOpacity={0.7}
          className="relative mt-3 h-60 w-full items-center justify-center rounded-xl"
        >
          <Image
            source={{ uri: thumbnail }}
            resizeMode="cover"
            className="mt-3 h-full w-full rounded-xl"
          />
          <Image
            source={icons.play}
            resizeMode="contain"
            className="absolute h-12 w-12"
          />
        </TouchableOpacity>
      )}
    </View>
  )
}
