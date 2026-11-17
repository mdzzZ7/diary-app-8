import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DiaryCard from "../../src/components/DiaryCard";
import {
  deleteAllDiaries,
  MOOD_OPTIONS,
  setMoodFilter,
  toggleFavorite,
} from "../../src/features/diary/diarySlice";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import { COLORS, LAYOUT, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

const HARI = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const BULAN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState("");
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = `${String(now.getHours()).padStart(2, "0")}:${String(
    now.getMinutes()
  ).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")} WIB`;

  const formattedDate = `${HARI[now.getDay()]}, ${String(now.getDate()).padStart(
    2,
    "0"
  )} ${BULAN[now.getMonth()]} ${now.getFullYear()}`;

  const entries = useAppSelector((state) => state.diary.entries);
  const moodFilter = useAppSelector((state) => state.diary.moodFilter);

  const totalDiary = useAppSelector((state) => state.diary.entries.length);
  const totalFavorite = useAppSelector(
    (state) => state.diary.entries.filter((item) => item.liked).length
  );

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredEntries = entries.filter((item) => {
    const matchMood = moodFilter === "ALL" || item.mood === moodFilter;
    const matchSearch =
      normalizedQuery === "" ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      item.body.toLowerCase().includes(normalizedQuery);
    return matchMood && matchSearch;
  });

  const handleDeleteAll = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Hapus SEMUA catatan diary dari Redux Store?")) {
        dispatch(deleteAllDiaries());
        setSearchQuery("");
      }
      return;
    }

    Alert.alert(
      "Hapus Semua Catatan",
      "Semua diary akan dihapus dari Redux Store.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus Semua",
          style: "destructive",
          onPress: () => {
            dispatch(deleteAllDiaries());
            setSearchQuery("");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.wrapper}>
        {/* Header Personal + Live Clock */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.badge}>MADDEV • JOURNAL</Text>
            <Text style={styles.header}>Catatan Harian</Text>
            <Text style={styles.ownerText}>Ahmad Yusuf</Text>
          </View>

          <View style={styles.clockCard}>
            <Text style={styles.clockTime}>{formattedTime}</Text>
            <Text style={styles.clockDate}>{formattedDate}</Text>
          </View>
        </View>

        {/* Statistik Total Diary & Total Favorite */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalDiary}</Text>
            <Text style={styles.statLabel}>Total Diary</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: COLORS.danger }]}>
              {totalFavorite}
            </Text>
            <Text style={styles.statLabel}>Total Favorite</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={COLORS.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Cari judul atau isi catatan..."
            placeholderTextColor={COLORS.muted}
            style={styles.searchInput}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={COLORS.muted} />
            </Pressable>
          )}
        </View>

        {/* Filter Mood */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <Pressable
              onPress={() => dispatch(setMoodFilter("ALL"))}
              style={[
                styles.filterChip,
                moodFilter === "ALL" && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  moodFilter === "ALL" && styles.filterTextActive,
                ]}
              >
                Semua ({totalDiary})
              </Text>
            </Pressable>

            {MOOD_OPTIONS.map((mood) => {
              const active = moodFilter === mood;
              return (
                <Pressable
                  key={mood}
                  onPress={() => dispatch(setMoodFilter(mood))}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                >
                  <Text style={styles.filterEmoji}>{mood}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Bar Judul List & Tombol Delete All */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            Daftar Catatan ({filteredEntries.length})
          </Text>

          {totalDiary > 0 && (
            <Pressable
              onPress={handleDeleteAll}
              style={({ pressed }) => [
                styles.deleteAllButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Ionicons name="trash-outline" size={14} color={COLORS.danger} />
              <Text style={styles.deleteAllText}>Hapus Semua</Text>
            </Pressable>
          )}
        </View>

        {/* Daftar Diary */}
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <DiaryCard
              title={item.title}
              date={item.date}
              preview={item.preview}
              mood={item.mood}
              liked={item.liked}
              onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
              onPress={() =>
                router.push({
                  pathname: "/detail/[id]",
                  params: { id: String(item.id) },
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>
                {normalizedQuery !== "" ? "🔍" : "📂"}
              </Text>
              <Text style={styles.emptyTitle}>
                {normalizedQuery !== ""
                  ? `Tidak ada hasil untuk "${searchQuery}"`
                  : moodFilter === "ALL"
                  ? "Belum ada catatan tersimpan"
                  : `Tidak ada catatan dengan mood ${moodFilter}`}
              </Text>
              <Text style={styles.emptyDesc}>
                {normalizedQuery !== ""
                  ? "Coba gunakan kata kunci lain atau hapus pencarian."
                  : moodFilter === "ALL"
                  ? "Buka tab Tulis Baru untuk mulai mencatat aktivitasmu hari ini."
                  : "Pilih filter 'Semua' atau buat catatan baru dengan mood tersebut."}
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
  },
  wrapper: {
    flex: 1,
    width: "100%",
    maxWidth: LAYOUT.maxWidth,
    paddingHorizontal: SPACE.l,
    paddingTop: 32,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACE.l,
  },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: COLORS.accent,
    marginBottom: 2,
  },
  header: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.text,
  },
  ownerText: {
    fontSize: TYPO.caption,
    color: COLORS.muted,
    marginTop: 2,
  },
  clockCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: "flex-end",
  },
  clockTime: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.accent,
    fontVariant: ["tabular-nums"],
  },
  clockDate: {
    fontSize: TYPO.caption,
    color: COLORS.muted,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: "row",
    gap: SPACE.m,
    marginBottom: SPACE.m,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: SPACE.m,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.accent,
  },
  statLabel: {
    fontSize: TYPO.caption,
    color: COLORS.muted,
    marginTop: 2,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: SPACE.s,
    marginBottom: SPACE.m,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: TYPO.body,
  },
  filterSection: {
    marginBottom: SPACE.m,
  },
  filterRow: {
    flexDirection: "row",
    gap: SPACE.s,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },
  filterChipActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  filterText: {
    fontSize: TYPO.body,
    fontWeight: "600",
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.background,
    fontWeight: "700",
  },
  filterEmoji: {
    fontSize: 18,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACE.s,
  },
  listTitle: {
    fontSize: TYPO.caption,
    fontWeight: "700",
    color: COLORS.muted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  deleteAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  deleteAllText: {
    color: COLORS.danger,
    fontSize: TYPO.caption,
    fontWeight: "700",
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACE.xl,
    marginTop: 16,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyIcon: {
    fontSize: 38,
    marginBottom: SPACE.s,
  },
  emptyTitle: {
    fontSize: TYPO.title,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: TYPO.body,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});