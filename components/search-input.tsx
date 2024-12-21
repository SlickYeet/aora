import { router, usePathname } from "expo-router"
import { useState } from "react"
import { Alert, Image, TextInput, TouchableOpacity, View } from "react-native"

import { icons } from "@/constants"

interface SearchInputProps {
  initialQuery?: string
}

export function SearchInput({ initialQuery }: SearchInputProps) {
  const pathname = usePathname()
  const [query, setQuery] = useState<string>(initialQuery || "")
  const [isFocused, setIsFocused] = useState<boolean>(false)

  const search = () => {
    if (!query) {
      return Alert.alert("Missing query", "Please enter a search query")
    }

    if (pathname.startsWith("/search")) {
      router.setParams({ query })
    } else {
      router.push(`/search/${query}`)
    }
  }

  return (
    <View
      className={`h-16 w-full flex-row items-center space-x-4 rounded-2xl border-2 border-black-200 px-4 ${isFocused ? "border-secondary" : "border-black-100"}`}
    >
      <TextInput
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onSubmitEditing={search}
        className="mt-0.5 flex-1 font-pregular text-base text-white"
      />

      <TouchableOpacity onPress={search}>
        <Image source={icons.search} resizeMode="contain" className="h-5 w-5" />
      </TouchableOpacity>
    </View>
  )
}
