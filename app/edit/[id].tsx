import { useEffect, useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../src/app/hooks";
import { editDiary, MOOD_OPTIONS } from "../../src/features/diary/diarySlice";
import { COLORS, LAYOUT, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

const showNotice = (title: string, message: string) => {
  if (Platform.OS === "web") {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export default function EditScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id } = useLocalSearchParams<{ id: string }>();

  const entry = useAppSelector((state) =>
    state.diary.entries.find((item) => item.id === Number(id))
  );

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState(MOOD_OPTIONS[0]);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setBody(entry.body);
      setMood(entry.mood);
    }
  }, [entry]);

  if (!entry) {
    return (
      <View style={styles.screen}>
        <Text style={{ color: COLORS.text, padding: 24 }}>
          Diary tidak ditemukan.
        </Text>
      </View>
    );
  }

  const handleUpdate = () => {
    if (!title.trim() || !body.trim()) {
      showNotice("Validasi", "Judul dan isi catatan wajib diisi.");
      return;
    }

    if (title.trim().length < 3) {
      showNotice("Validasi", "Judul diary minimal 3 karakter.");
      return;
    }

    dispatch(
      editDiary({
        id: entry.id,
        title: title.trim(),
        body: body.trim(),
        mood,
      })
    );

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.wrapper}>
        <Text style={styles.badge}>UPDATE ENTRY</Text>
        <Text style={styles.heading}>Edit Catatan</Text>

        <Text style={styles.label}>Judul Catatan</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Minimal 3 karakter..."
          placeholderTextColor={COLORS.muted}
          style={styles.input}
        />

        <Text style={styles.label}>Isi Cerita</Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Ceritakan harimu..."
          placeholderTextColor={COLORS.muted}
          multiline
          style={[styles.input, styles.bodyInput]}
        />

        <Text style={styles.label}>Pilih Mood</Text>
        <View style={styles.moodRow}>
          {MOOD_OPTIONS.map((item) => (
            <Pressable
              key={item}
              onPress={() => setMood(item)}
              style={[styles.moodButton, mood === item && styles.selectedMood]}
            >
              <Text style={styles.mood}>{item}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleUpdate}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.buttonText}>Simpan Perubahan</Text>
        </Pressable>
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
    paddingTop: 24,
  },
  badge: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: COLORS.accent,
    marginBottom: 2,
  },
  heading: {
    fontSize: TYPO.h1,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACE.l,
  },
  label: {
    fontSize: TYPO.caption,
    fontWeight: "600",
    color: COLORS.muted,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    padding: 14,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
    marginBottom: SPACE.m,
    fontSize: TYPO.body,
  },
  bodyInput: {
    minHeight: 160,
    textAlignVertical: "top",
  },
  moodRow: {
    flexDirection: "row",
    gap: SPACE.s,
    marginBottom: SPACE.xl,
  },
  moodButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    backgroundColor: COLORS.surface,
  },
  selectedMood: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.surfaceHover,
    borderWidth: 2,
  },
  mood: {
    fontSize: 26,
  },
  button: {
    padding: 16,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.accent,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.background,
    fontWeight: "700",
    fontSize: 15,
  },
});