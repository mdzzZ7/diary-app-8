import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, RADIUS, SPACE, TYPO } from "../styles/tokens";

type Props = {
  title: string;
  date: string;
  preview: string;
  mood: string;
  liked: boolean;
  onPress: () => void;
  onToggleFavorite: () => void;
};

export default function DiaryCard({
  title,
  date,
  preview,
  mood,
  liked,
  onPress,
  onToggleFavorite,
}: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.main, pressed && styles.pressed]}
      >
        <View style={styles.moodBox}>
          <Text style={styles.mood}>{mood}</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.topMeta}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <Text style={styles.preview} numberOfLines={2}>
            {preview}
          </Text>
        </View>
      </Pressable>

      <Pressable
        onPress={onToggleFavorite}
        style={({ pressed }) => [
          styles.favoriteButton,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.favorite, liked && styles.favoriteActive]}>
          {liked ? "♥" : "♡"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    marginBottom: SPACE.m,
    overflow: "hidden",
  },
  main: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACE.m,
    padding: SPACE.l,
  },
  pressed: {
    backgroundColor: COLORS.surfaceHover,
  },
  moodBox: {
    width: 54,
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mood: {
    fontSize: 26,
  },
  content: {
    flex: 1,
  },
  topMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: SPACE.s,
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: TYPO.title,
    fontWeight: "700",
    color: COLORS.text,
  },
  date: {
    fontSize: TYPO.caption,
    color: COLORS.accent,
    fontWeight: "600",
  },
  preview: {
    fontSize: TYPO.body,
    color: COLORS.muted,
    lineHeight: 20,
  },
  favoriteButton: {
    paddingHorizontal: SPACE.l,
    paddingVertical: SPACE.xl,
  },
  favorite: {
    fontSize: 26,
    color: COLORS.muted,
  },
  favoriteActive: {
    color: COLORS.danger,
  },
});