import { Text, TouchableOpacity } from "react-native"

interface CustomButtonProps {
  title: string
  handlePress?: () => void
  isLoading?: boolean
  className?: string
  textClassName?: string
}

export function CustomButton({
  title,
  handlePress,
  isLoading,
  className,
  textClassName,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      disabled={isLoading}
      onPress={handlePress}
      activeOpacity={0.7}
      className={`flex min-h-[62px] items-center justify-center rounded-xl bg-secondary ${className} ${
        isLoading ? "opacity-50" : "opacity-100"
      }`}
    >
      <Text className={`font-psemibold text-lg text-primary ${textClassName}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}
