import { Link, router } from "expo-router"
import { useState } from "react"
import { Alert, Image, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

import { CustomButton } from "@/components/CustomButton"
import { FormField } from "@/components/form-field"
import { images } from "@/constants"
import { useGlobalContext } from "@/context/global-provider"
import { createUser } from "@/lib/appwrite"

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const { setUser, setIsLoggedIn } = useGlobalContext()

  const submit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill in all fields")
    }

    setIsSubmitting(true)

    try {
      const user = await createUser(form.email, form.password, form.username)

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
            Sign up to Aora
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e: string) => setForm({ ...form, username: e })}
            className="mt-10"
          />
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
            title="Sign Up"
            handlePress={submit}
            isLoading={isSubmitting}
            className="mt-7"
          />

          <View className="flex-row justify-center gap-2 pt-5">
            <Text className="font-pregular text-lg text-gray-100">
              Already have an account?
            </Text>
            <Link
              href="/sign-in"
              className="font-psemibold text-lg text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
