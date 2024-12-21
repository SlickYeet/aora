import { Text, View } from "react-native"

interface InfoBoxProps {
  title: string | number
  subtitle?: string
  titleClassName?: string
  className?: string
}

export function InfoBox({
  title,
  subtitle,
  titleClassName,
  className,
}: InfoBoxProps) {
  return (
    <View className={className}>
      <Text
        className={`text-center font-psemibold text-white ${titleClassName}`}
      >
        {title}
      </Text>
      <Text className="text-center font-pregular text-sm text-gray-100">
        {subtitle}
      </Text>
    </View>
  )
}
