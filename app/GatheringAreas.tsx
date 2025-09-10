import React, { useState, useRef, useEffect } from "react";
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  Animated, Platform, ScrollView 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { GradientHeader } from "../components/common/GradientHeader";
import { COLORS, SIZES, SPACING, SHADOWS } from "../constants/styles";


import izmirJson from "../assets/areas/izmir.json";
import istanbulTuzlaJson from "../assets/areas/tuzla.json";

interface ToplanmaAlani {
  id: string;
  ad: string;
  kategoriAdi?: string;
  il: string;
  ilce: string;
  mahalle: string;
  durum?: string;
  boylam: number;
  enlem: number;
  elektrik?: string;
  kullanımAlani?: number;
  otomatikHesaplananAlan?: number;
  su?: string;
  tabelaKod?: string;
  toplamAlan?: number;
  toplamÇadırKonteynerSayısı?: string;
  tur?: string;
  veriUretim?: string;
  wcKanalizasyon?: string;
  yolDurumu?: string;
  yol?: string;
  kapiNo?: string;
  aciklama?: string;
}

// Tuzla JSON mapping
const mapTuzlaJsonToToplanmaAlani = (json: any): ToplanmaAlani[] => {
  return json.records.map((r: any[]) => ({
    id: r[1], // ID
    ad: r[2], // AD
    kategoriAdi: r[3], // KATEGORI ADI
    il: r[4], // IL ADI
    ilce: r[5], // ILCE ADI
    mahalle: r[6], // MAHALLE ADI
    durum: r[7], // DURUM
    boylam: r[8], // BOYLAM
    enlem: r[9], // ENLEM
    elektrik: r[10], // ELEKTRIK
    kullanımAlani: r[11], // KULLANIM ALANI
    otomatikHesaplananAlan: r[12], // OTOMATIK HESAPLANAN ALAN
    su: r[13], // SU
    tabelaKod: r[14], // TABELA KOD
    toplamAlan: r[15], // TOPLAM ALAN
    toplamÇadırKonteynerSayısı: r[16], // TOPLAM CADIR / KONTEYNER SAYISI
    tur: r[17], // TUR
    veriUretim: r[18], // VERI URETIM
    wcKanalizasyon: r[19], // WC / KANALIZASYON
    yolDurumu: r[20], // YOL DURUMU
  }));
};

// İzmir JSON mapping
const mapIzmirJsonToToplanmaAlani = (json: any): ToplanmaAlani[] => {
  return json.records.map((r: any[]) => ({
    id: r[4] || r[0].toString(), // ACIKLAMA veya _id
    ad: r[8], // ADI
    il: "İzmir", // Sabit değer
    ilce: r[1], // ILCE
    mahalle: r[6], // MAHALLE
    durum: "Aktif", // Varsayılan değer
    boylam: r[9], // BOYLAM
    enlem: r[3], // ENLEM
    yol: r[10], // YOL
    kapiNo: r[2], // KAPINO
    aciklama: r[4], // ACIKLAMA
    tabelaKod: r[4], // ACIKLAMA'yı tabelaKod olarak kullan
    tur: "Toplanma Alanı", // Varsayılan değer
    elektrik: "Bilinmiyor",
    su: "Bilinmiyor",
    wcKanalizasyon: "Bilinmiyor",
    yolDurumu: "Bilinmiyor",
  }));
};


const izmirAlanlari: ToplanmaAlani[] = mapIzmirJsonToToplanmaAlani(izmirJson);
const istanbulTuzlaAlanlari: ToplanmaAlani[] = mapTuzlaJsonToToplanmaAlani(istanbulTuzlaJson);


const toplanmaAlanlari: ToplanmaAlani[] = [...izmirAlanlari, ...istanbulTuzlaAlanlari];

export default function GatheringAreas() {
  const router = useRouter();
  const [selectedIl, setSelectedIl] = useState<string>("");
  const [selectedIlce, setSelectedIlce] = useState<string>("");
  const [selectedMahalle, setSelectedMahalle] = useState<string>("");
  const [showFilters, setShowFilters] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in animasyonu
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);


  const iller = Array.from(new Set(toplanmaAlanlari.map(a => a.il)));


  const ilceler = Array.from(
    new Set(
      toplanmaAlanlari
        .filter(a => a.il === selectedIl)
        .map(a => a.ilce)
    )
  );


  const mahalleler = Array.from(
    new Set(
      toplanmaAlanlari
        .filter(a => a.il === selectedIl && a.ilce === selectedIlce)
        .map(a => a.mahalle)
    )
  );


  const filteredAlanlar = toplanmaAlanlari.filter(a =>
    a.il === selectedIl &&
    (selectedIlce === "" || a.ilce === selectedIlce) &&
    (selectedMahalle === "" || a.mahalle === selectedMahalle) &&
    (a.durum === "Aktif" || a.durum === undefined)
  );

  const toggleFilters = () => {
    if (showFilters) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowFilters(false));
    } else {
      setShowFilters(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const AnimatedCard = ({ item, index }: { item: ToplanmaAlani; index: number }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;
    
    useEffect(() => {
      Animated.spring(cardAnim, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View 
        style={[
          styles.alanCard,
          {
            opacity: cardAnim,
            transform: [
              {
                translateY: cardAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }
            ]
          }
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardIcon}>
            <Ionicons name="location" size={20} color="#fff" />
          </View>
          <Text style={styles.alanAd}>{item.ad}</Text>
        </View>
        
        <View style={styles.locationContainer}>
          <Ionicons name="navigate" size={14} color={COLORS.textSecondary} />
          <Text style={styles.alanLocation}>
            {item.ilce} / {item.mahalle}
          </Text>
        </View>
        
        <Text style={styles.alanType}>
          <Ionicons name="pricetag" size={14} color={COLORS.primary} />
          {item.tur || "Toplanma Alanı"}
        </Text>
        
        <View style={styles.facilitiesContainer}>
          <View style={styles.facility}>
            <Ionicons name="flash" size={14} color={COLORS.success} />
            <Text style={styles.facilityText}>{item.elektrik || "Bilinmiyor"}</Text>
          </View>
          <View style={styles.facility}>
            <Ionicons name="water" size={14} color={COLORS.info} />
            <Text style={styles.facilityText}>{item.su || "Bilinmiyor"}</Text>
          </View>
          <View style={styles.facility}>
            <Ionicons name="car" size={14} color={COLORS.warning} />
            <Text style={styles.facilityText}>{item.yolDurumu || "Bilinmiyor"}</Text>
          </View>
          <View style={styles.facility}>
            <Ionicons name="man" size={14} color="#6f42c1" />
            <Text style={styles.facilityText}>{item.wcKanalizasyon || "Bilinmiyor"}</Text>
          </View>
        </View>
        
        <View style={styles.areaInfo}>
          {item.toplamAlan && (
            <View style={styles.areaDetail}>
              <Ionicons name="expand" size={14} color={COLORS.textSecondary} />
              <Text style={styles.areaText}>
                {item.toplamAlan.toLocaleString('tr-TR')} m²
              </Text>
            </View>
          )}
          {item.yol && item.kapiNo && (
            <View style={styles.areaDetail}>
              <Ionicons name="navigate" size={14} color={COLORS.textSecondary} />
              <Text style={styles.locationDetail}>
                {item.yol} {item.kapiNo}
              </Text>
            </View>
          )}
          <View style={styles.areaDetail}>
            <Ionicons name="globe" size={14} color={COLORS.textSecondary} />
            <Text style={styles.coordinateText}>
              {item.enlem.toFixed(6)}, {item.boylam.toFixed(6)}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <GradientHeader
        title="Toplanma Alanları"
        subtitle={selectedIl ? `${filteredAlanlar.length} alan bulundu` : "Lütfen il seçiniz"}
        rightComponent={
          <TouchableOpacity 
            style={styles.filterToggle}
            onPress={toggleFilters}
          >
            <Ionicons 
              name={showFilters ? "filter" : "filter-outline"} 
              size={24} 
              color="white" 
            />
          </TouchableOpacity>
        }
      />

      {showFilters && (
        <Animated.View 
          style={[
            styles.filterContainer,
            {
              opacity: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
              }),
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -100]
                  })
                }
              ]
            }
          ]}
        >
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>İl Seçiniz</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedIl}
                onValueChange={(itemValue) => {
                  setSelectedIl(itemValue);
                  setSelectedIlce("");
                  setSelectedMahalle("");
                }}
                style={styles.picker}
              >
                <Picker.Item label="İl seçiniz..." value="" />
                {iller.map((il, i) => (
                  <Picker.Item key={i} label={il} value={il} />
                ))}
              </Picker>
            </View>
          </View>

          {selectedIl && (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>İlçe Seçiniz</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedIlce}
                  onValueChange={(itemValue) => {
                    setSelectedIlce(itemValue);
                    setSelectedMahalle("");
                  }}
                  style={styles.picker}
                >
                  <Picker.Item label="Tüm ilçeler" value="" />
                  {ilceler.map((ilce, i) => (
                    <Picker.Item key={i} label={ilce} value={ilce} />
                  ))}
                </Picker>
              </View>
            </View>
          )}

          {selectedIlce && (
            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Mahalle Seçiniz</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedMahalle}
                  onValueChange={(itemValue) => setSelectedMahalle(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="Tüm mahalleler" value="" />
                  {mahalleler.map((mahalle, i) => (
                    <Picker.Item key={i} label={mahalle} value={mahalle} />
                  ))}
                </Picker>
              </View>
            </View>
          )}
        </Animated.View>
      )}

      {selectedIl ? (
        <View style={styles.resultsContainer}>
          {filteredAlanlar.length > 0 ? (
            <FlatList
              data={filteredAlanlar}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => <AnimatedCard item={item} index={index} />}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.noResultContainer}>
              <Ionicons name="search" size={60} color={COLORS.gray400} />
              <Text style={styles.noResultText}>
                Seçilen kriterlere uygun toplanma alanı bulunamadı.
              </Text>
              <Text style={styles.noResultSubtext}>
                Lütfen farklı bir il, ilçe veya mahalle seçin.
              </Text>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Ionicons name="map" size={80} color="#b8d0e3" />
          <Text style={styles.placeholderText}>
            Lütfen yukarıdan bir il seçerek toplanma alanlarını görüntüleyin
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background 
  },
  filterToggle: {
    padding: SPACING.xs,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    ...SHADOWS.md,
    marginBottom: SPACING.sm,
  },
  pickerContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: SPACING.sm,
    color: COLORS.textPrimary,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: COLORS.gray50,
  },
  picker: {
    height: 50,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  listContent: {
    paddingBottom: SPACING.lg,
  },
  alanCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: 16,
    marginVertical: SPACING.sm,
    ...SHADOWS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: SPACING.sm,
  },
  alanAd: {
    fontSize: SIZES.isSmallScreen ? 16 : 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  alanLocation: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  alanType: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    marginBottom: SPACING.sm,
  },
  facilitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: SPACING.sm,
  },
  facility: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  facilityText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  areaInfo: {
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingTop: SPACING.sm,
  },
  areaDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.xs,
  },
  areaText: {
    fontSize: 14,
    color: COLORS.textPrimary,
    fontWeight: "500",
    marginLeft: SPACING.sm,
  },
  coordinateText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  locationDetail: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
    marginLeft: SPACING.sm,
  },
  noResultContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxxl,
  },
  noResultText: {
    fontSize: SIZES.isSmallScreen ? 16 : 18,
    fontWeight: "600",
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  noResultSubtext: {
    fontSize: 14,
    color: COLORS.textTertiary,
    textAlign: "center",
  },
  placeholderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xxxl,
  },
  placeholderText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: SPACING.lg,
    lineHeight: 24,
  },
});