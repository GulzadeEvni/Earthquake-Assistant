import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, StatusBar, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const wp = (percentage: number) => (SCREEN_WIDTH * percentage) / 100;
const hp = (percentage: number) => (SCREEN_HEIGHT * percentage) / 100;

type PageRoute = 
  | "DepremAninda" 
  | "DepremSonrasi" 
  | "Yaralanmalar" 
  | "Ihtiyaclar" 
  | "Simulasyon" 
  | "GatheringAreas" 
  | "ChatScreen";

interface ButtonItem {
  title: string;
  type?: "map";
  page?: PageRoute;
  icon: keyof typeof Ionicons.glyphMap;
}

export default function Index() {
  const router = useRouter();

  const buttons: ButtonItem[] = [
    { title: "En yakın toplanma alanını öğren", type: "map", icon: "location" },
    { title: "Deprem anında yapılması gerekenler", page: "DepremAninda", icon: "alert-circle" },
    { title: "Deprem sonrasında yapılması gerekenler", page: "DepremSonrasi", icon: "home" },
    { title: "Yaralanmalarda nasıl davranılmalı", page: "Yaralanmalar", icon: "medkit" },
    { title: "Temel ihtiyaçlar ve planlama", page: "Ihtiyaclar", icon: "basket" },
    { title: "Simülasyon modu", page: "Simulasyon", icon: "game-controller" },
  ];

  const handleButtonPress = (button: ButtonItem) => {
    if (button.type === "map") {
      router.push("/GatheringAreas" as any);
    } else if (button.page) {
      const routes: Record<PageRoute, () => void> = {
        DepremAninda: () => router.push("/DepremAninda"),
        DepremSonrasi: () => router.push("/DepremSonrasi"),
        Yaralanmalar: () => router.push("/Yaralanmalar"),
        Ihtiyaclar: () => router.push("/Ihtiyaclar"),
        Simulasyon: () => router.push("/Simulasyon"),
        GatheringAreas: () => router.push("/GatheringAreas"),
        ChatScreen: () => router.push("/ChatScreen"),
      };
      
      routes[button.page]();
    }
  };

  const handleChatPress = () => {
    router.push("/ChatScreen");
  };

  const cardSize = (SCREEN_WIDTH - wp(20)) / 2; 

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#e6f7ff" />
      
      <LinearGradient colors={["#e6f7ff", "#ffffff"]} style={styles.gradient}>
        {/* ScrollView ile içerik kaydırma */}
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Ionicons name="shield-checkmark" size={wp(10)} color="#0984e3" style={{ marginRight: wp(2) }} />
              <Text style={styles.title}>Deprem Destek</Text>
            </View>
            <Text style={styles.subtitle}>
              Afet anında hızlı bilgi ve güvenli adımlar için yanınızdayım.
            </Text>
          </View>

          
          <View style={styles.buttonGrid}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card, { width: cardSize, height: cardSize }]}
                onPress={() => handleButtonPress(button)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#4a90e2", "#5bc0de"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  <Ionicons 
                    name={button.icon} 
                    size={wp(12)} 
                    color="white" 
                    style={{ marginBottom: hp(1) }} 
                  />
                  <Text style={styles.cardText}>{button.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          
          <View style={{ height: hp(12) }} />
        </ScrollView>

        
        <View style={styles.chatButtonContainer}>
          <TouchableOpacity 
            style={styles.chatButton} 
            onPress={handleChatPress} 
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#ff6b35", "#ff8e53"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.chatButtonGradient}
            >
              <Ionicons name="chatbubbles" size={wp(7)} color="white" style={{ marginRight: wp(2) }} />
              <Text style={styles.chatButtonText}>Sohbet Başlat</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f7ff",
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(4),
    paddingTop: hp(8), 
    paddingBottom: hp(6),
  },
  
  // Header
  header: {
    alignItems: "center",
    marginBottom: hp(3),
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },
  title: {
    fontSize: wp(8), 
    fontWeight: "800",
    color: "#2d3436",
  },
  subtitle: {
    fontSize: wp(4.5),
    color: "#636e72",
    textAlign: "center",
    lineHeight: wp(6),
    marginTop: hp(1),
    paddingHorizontal: wp(5),
  },

 
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: hp(2),
    paddingHorizontal: wp(1),
  },
  card: {
    borderRadius: wp(5),
    margin: wp(1.5), 
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  cardGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: wp(3),
    borderRadius: wp(5),
  },
  cardText: {
    fontSize: wp(3.2),
    textAlign: "center",
    color: "white",
    fontWeight: "600",
    lineHeight: wp(4),
  },

  
  chatButtonContainer: {
    position: 'absolute',
    bottom: hp(5), 
    left: 0,
    right: 0,
    paddingHorizontal: wp(5),
    alignItems: 'center',
  },


  chatButton: {
    borderRadius: wp(7),
    overflow: "hidden",
    width: '90%', 
  },
  chatButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2), 
    paddingHorizontal: wp(6),
    borderRadius: wp(7),
  },
  chatButtonText: {
    color: "white",
    fontSize: wp(4.8), 
    fontWeight: "700",
  },
});