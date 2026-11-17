import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import { deleteDiary, toggleFavorite } from "../../src/features/diary/diarySlice";
import { COLORS, LAYOUT, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

export default function DetailScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === Number(id))
  );

  if (!entry) {
    return (
      <View style={styles.screen}>
        <Text style={{ color: COLORS.text, padding: 24 }}>
          Diary tidak ditemukan.
        </Text>
      </View>
    );
  }

  const confirmDelete = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Hapus catatan ini dari Redux Store?")) {
        dispatch(deleteDiary(entry.id));
        router.replace("/");
      }
      return;
    }

    Alert.alert("Hapus Diary", "Diary akan dihapus dari Redux Store.", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          dispatch(deleteDiary(entry.id));
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={styles.screen}
    >
      <View style={styles.wrapper}>
        <View style={styles.articleCard}>
          <View style={styles.topRow}>
            <Text style={styles.mood}>{entry.mood}</Text>
            <Text style={styles.dateBadge}>{entry.date}</Text>
          </View>
          <Text style={styles.title}>{entry.title}</Text>
          <View style={styles.divider} />
          <Text style={styles.body}>{entry.body}</Text>
        </View>

        <View style={styles.actionGroup}>
          <Pressable
            onPress={() => dispatch(toggleFavorite(entry.id))}
            style={({ pressed }) => [
              styles.favoriteButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.darkBtnText}>
              {entry.liked ? "♥ Hapus dari Favorit" : "♡ Tambah ke Favorit"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/edit/[id]",
                params: { id: String(entry.id) },
              })
            }
            style={({ pressed }) => [
              styles.editButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.editText}>Edit Catatan</Text>
          </Pressable>

          <Pressable
            onPress={confirmDelete}
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.deleteText}>Hapus Catatan</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    paddingVertical: SPACE.xl,
  },
  wrapper: {
    width: "100%",
    maxWidth: LAYOUT.maxWidth,
    paddingHorizontal: SPACE.l,
    gap: SPACE.l,
  },
  articleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACE.xl,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACE.m,
  },
  mood: {
    fontSize: 44,
  },
  dateBadge: {
    fontSize: TYPO.caption,
    fontWeight: "700",
    color: COLORS.accent,
    backgroundColor: COLORS.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACE.l,
  },
  body: {
    fontSize: 16,
    lineHeight: 26,
    color: COLORS.text,
  },
  actionGroup: {
    gap: SPACE.m,
  },
  favoriteButton: {
    padding: 15,
    alignItems: "center",
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.accent,
  },
  darkBtnText: {
    color: COLORS.background,
    fontWeight: "700",
    fontSize: 15,
  },
  editButton: {
    padding: 15,
    alignItems: "center",
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  editText: {
    color: COLORS.accent,
    fontWeight: "700",
    fontSize: 15,
  },
  deleteButton: {
    padding: 15,
    alignItems: "center",
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  deleteText: {
    color: COLORS.danger,
    fontWeight: "700",
    fontSize: 15,
  },
});