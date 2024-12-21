import { Tabs } from "expo-router"
import React from "react"
import type { ImageSourcePropType } from "react-native"
import { Image, Text, View } from "react-native"

import { icons } from "@/constants"

type TabIconProps = {
  icon: ImageSourcePropType
  color: string
  name: string
  focused: boolean
}

function TabIcon({ icon, color, name, focused }: TabIconProps) {
  return (
    <View className="items-center justify-center gap-2 pt-10">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className={`${name === "Create" ? "h-8 w-8" : "h-6 w-6"}`}
      />
      <Text
        className={`${
          focused ? "font-psemibold" : "font-pregular"
        } min-w-16 text-center ${name === "Create" ? "text-sm" : "text-xs"} `}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  )
}

export default function TabsLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 0,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Create"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  )
}
