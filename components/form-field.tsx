import React, { useState } from "react"
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native"

import { icons } from "@/constants"

interface FormFieldProps {
  title: string
  value: string
  placeholder?: string
  handleChangeText: (e: string) => void
  keyboardType?: "default" | "email-address"
  className?: string
}

export function FormField({
  title,
  value,
  placeholder,
  handleChangeText,
  keyboardType = "default",
  className,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isFocused, setIsFocused] = useState<boolean>(false)

  return (
    <View className={`space-y-2 ${className}`}>
      <Text className="font-pmedium text-base text-gray-100">{title}</Text>

      <View
        className={`${isFocused ? "border-secondary" : "border-black-200"} h-16 w-full flex-row items-center rounded-2xl border-2 px-4`}
      >
        <TextInput
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          keyboardType={keyboardType}
          secureTextEntry={title === "Password" && !showPassword}
          className="mt-1 flex-1 font-psemibold text-base text-white"
        />

        {title === "Password" ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="size-8"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  )
}
