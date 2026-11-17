import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import {
  clearAllFavorites,
  toggleFavorite,
} from "../../src/features/diary/diarySlice";
import DiaryCard from "../../src/components/DiaryCard";
import { COLORS, LAYOUT, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

export default function FavoritesScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const favoriteEntries = useAppSelector((state) =>
    state.diary.entries.filter((entry) => entry.liked)
  );

  const handleClearFavorites = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Kosongkan semua catatan dari daftar favorit?")) {
        dispatch(clearAllFavorites());
      }
      return;
    }

    Alert.alert(
      "Hapus Semua Favorite",
      "Semua diary akan dihapus dari daftar favorite.",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Kosongkan",
          style: "destructive",
          onPress: () => dispatch(clearAllFavorites()),
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.wrapper}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.badge}>BOOKMARKED</Text>
            <Text style={styles.header}>Catatan Favorit</Text>
            <Text style={styles.counter}>
              {favoriteEntries.length} catatan ditandai favorit
            </Text>
          </View>

          {favoriteEntries.length > 0 && (
            <Pressable
              onPress={handleClearFavorites}
              style={({ pressed }) => [
                styles.clearButton,
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </Pressable>
          )}
        </View>

        <FlatList
          data={favoriteEntries}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
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
              <Text style={styles.emptyIcon}>🤍</Text>
              <Text style={styles.emptyTitle}>Belum ada catatan favorit</Text>
              <Text style={styles.emptyDesc}>
                Klik ikon hati (♡) pada kartu diary di halaman Beranda untuk
                menyimpan catatan favoritmu ke sini.
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
    color: COLORS.danger,
    marginBottom: 2,
  },
  header: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.text,
  },
  counter: {
    color: COLORS.muted,
    marginTop: 2,
  },
  clearButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  clearButtonText: {
    color: COLORS.danger,
    fontWeight: "700",
    fontSize: TYPO.caption,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    padding: SPACE.xl,
    marginTop: 24,
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
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: TYPO.body,
    color: COLORS.muted,
    textAlign: "center",
    lineHeight: 20,
  },
});