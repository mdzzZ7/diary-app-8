import { useState } from "react";
import { Alert, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { useAppDispatch } from "../../src/app/hooks";
import { addDiary, MOOD_OPTIONS } from "../../src/features/diary/diarySlice";
import { COLORS, LAYOUT, RADIUS, SPACE, TYPO } from "../../src/styles/tokens";

const showNotice = (title: string, message: string) => {
  if (Platform.OS === "web") {
    window.alert(`${title}: ${message}`);
  } else {
    Alert.alert(title, message);
  }
};

const formatWaktuSekarang = () => {
  const now = new Date();
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const tgl = String(now.getDate()).padStart(2, "0");
  const bln = bulan[now.getMonth()];
  const thn = now.getFullYear();
  const jam = String(now.getHours()).padStart(2, "0");
  const mnt = String(now.getMinutes()).padStart(2, "0");
  return `${tgl} ${bln} ${thn} • ${jam}:${mnt}`;
};

export default function CreateScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mood, setMood] = useState(MOOD_OPTIONS[0]);

  const saveDiary = () => {
    if (!title.trim() || !body.trim()) {
      showNotice("Validasi", "Judul dan isi catatan wajib diisi.");
      return;
    }

    if (title.trim().length < 3) {
      showNotice("Validasi", "Judul diary minimal 3 karakter.");
      return;
    }

    dispatch(
      addDiary({
        title: title.trim(),
        date: formatWaktuSekarang(),
        preview: body.trim().slice(0, 100),
        body: body.trim(),
        mood,
      })
    );

    setTitle("");
    setBody("");
    setMood(MOOD_OPTIONS[0]);
    router.replace("/");
  };

  return (
    <View style={styles.screen}>
      <View style={styles.wrapper}>
        <Text style={styles.badge}>NEW ENTRY</Text>
        <Text style={styles.heading}>Tulis Catatan Baru</Text>

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
          placeholder="Ceritakan progres atau kegiatanmu hari ini..."
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
          onPress={saveDiary}
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.buttonText}>Simpan ke Redux Store</Text>
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
    paddingTop: 32,
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