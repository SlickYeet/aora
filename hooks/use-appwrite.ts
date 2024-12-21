import { useEffect, useState } from "react"
import { Alert } from "react-native"

import { Video } from "@/types"

export function useAppwrite(fn: Function) {
  const [data, setData] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fn()
      setData(response)
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refetch = () => fetchData()

  return {
    videos: data,
    isLoading,
    refetch,
  }
}
