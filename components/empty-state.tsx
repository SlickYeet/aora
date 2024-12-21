import { router } from "expo-router"
import { Image, Text, View } from "react-native"

import { CustomButton } from "@/components/CustomButton"
import { images } from "@/constants"

interface EmptyStateProps {
  title: string
  subtitle: string
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View className="items-center justify-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="h-[215px] w-[270px]"
      />

      <Text className="text-center font-psemibold text-xl text-white">
        {title}
      </Text>
      <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>

      <CustomButton
        title="Create video"
        handlePress={() => router.push("/create")}
        className="my-5 w-full"
      />
    </View>
  )
}
