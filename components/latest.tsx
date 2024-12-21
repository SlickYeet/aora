import { useVideoPlayer, VideoView } from "expo-video"
import React, { useEffect, useState } from "react"
import {
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from "react-native"
import * as Animatable from "react-native-animatable"

import { icons } from "@/constants"
import { Video as VideoType } from "@/types"

interface LatestItemProps {
  activeItem: VideoType
  item: VideoType
}

const zoomIn = {
  0: {
    transform: [{ scale: 0.9 }],
  },
  1: {
    transform: [{ scale: 1 }],
  },
}
const zoomOut = {
  0: {
    transform: [{ scale: 1 }],
  },
  1: {
    transform: [{ scale: 0.9 }],
  },
}

function LatestItem({ activeItem, item }: LatestItemProps) {
  const [play, setPlay] = useState<boolean>(false)

  const player = useVideoPlayer(item.video, (player) => {
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
    <Animatable.View
      animation={activeItem.$id === item.$id ? zoomIn : zoomOut}
      duration={500}
      className="mr-5"
    >
      {play ? (
        <View className="mt-3 h-72 w-52 rounded-[35px] bg-white/10">
          <VideoView
            player={player}
            allowsPictureInPicture={false}
            nativeControls
            style={{ height: "100%", width: "100%", borderRadius: 35 }}
          />
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setPlay(true)}
          activeOpacity={0.7}
          className="relative items-center justify-center"
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            resizeMode="cover"
            className="my-5 h-72 w-52 overflow-hidden rounded-[35px] shadow-lg shadow-black/40"
          />

          <Image
            source={icons.play}
            resizeMode="contain"
            className="absolute h-12 w-12"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

interface LatestProps {
  videos: VideoType[]
}

export function Latest({ videos }: LatestProps) {
  const [activeItem, setActiveItem] = useState(videos[0])

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: Array<{ item: VideoType }>
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item)
    }
  }

  return (
    <FlatList
      data={videos}
      keyExtractor={(item) => item.$id.toString()}
      horizontal
      onViewableItemsChanged={viewableItemsChanged}
      viewabilityConfig={{
        itemVisiblePercentThreshold: 70,
      }}
      //   contentOffset={{ x: 0, y: 0 }}
      renderItem={({ item }) => (
        <LatestItem activeItem={activeItem} item={item} />
      )}
    />
  )
}
