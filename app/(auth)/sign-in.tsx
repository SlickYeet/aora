import { Link, router } from "expo-router"
import { useState } from "react"
import { Alert, Image, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { CustomButton } from "@/components/CustomButton"
import { FormField } from "@/components/form-field"
import { images } from "@/constants"
import { useGlobalContext } from "@/context/global-provider"
import { getCurrentUser, signIn } from "@/lib/appwrite"

export default function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { setUser, setIsLoggedIn } = useGlobalContext()

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields")
    }

    setIsSubmitting(true)

    try {
      await signIn(form.email, form.password)

      const user = await getCurrentUser()
      if (user) {
        setUser(user)
        setIsLoggedIn(true)
      }

      router.replace("/home")
    } catch (error: any) {
      Alert.alert("Error", error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView className="h-full bg-primary">
      <ScrollView>
        <View className="my-6 min-h-[85vh] w-full justify-center px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="h-[35px] w-[115px]"
          />

          <Text className="mt-10 font-psemibold text-2xl font-semibold text-white">
            Log in to Aora
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            keyboardType="email-address"
            className="mt-7"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            className="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            isLoading={isSubmitting}
            className="mt-7"
          />

          <View className="flex-row justify-center gap-2 pt-5">
            <Text className="font-pregular text-lg text-gray-100">
              Don&apos;t have an account?
            </Text>
            <Link
              href="/sign-up"
              className="font-psemibold text-lg text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
