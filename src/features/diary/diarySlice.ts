import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type DiaryEntry = {
  id: number;
  title: string;
  date: string;
  preview: string;
  body: string;
  mood: string;
  liked: boolean;
};

type DiaryState = {
  entries: DiaryEntry[];
  filter: "all" | "favorite";
  moodFilter: string;
};

export const MOOD_OPTIONS = ["💻", "🔥", "😌", "☕", "😴"];

const initialState: DiaryState = {
  entries: [
    {
      id: 1,
      title: "Eksplorasi Redux Toolkit",
      date: "17 Nov 2026 • 09:15",
      preview: "Memindahkan state aplikasi ke global store supaya antar screen sinkron.",
      body: "Hari ini belajar mengelola global state di React Native menggunakan Redux Toolkit dan Expo Router. Ternyata struktur slice membuat kode jauh lebih rapi dan mudah di-debug.",
      mood: "💻",
      liked: true,
    },
    {
      id: 2,
      title: "Ngopi Sore & Review Kode",
      date: "16 Nov 2026 • 16:40",
      preview: "Istirahat sejenak setelah beres ngerjain project web dan mobile.",
      body: "Menikmati suasana sore di Sukabumi sambil merapikan komponen UI dan memastikan alur CRUD berjalan lancar tanpa bug.",
      mood: "☕",
      liked: false,
    },
    {
      id: 3,
      title: "Target Praktikum Selesai",
      date: "15 Nov 2026 • 20:10",
      preview: "Semua fitur tambah, edit, hapus, dan filter mood berjalan normal.",
      body: "Senang rasanya ketika seluruh fitur praktikum berhasil dijalankan di laptop maupun perangkat mobile dengan tampilan yang konsisten.",
      mood: "🔥",
      liked: true,
    },
  ],
  filter: "all",
  moodFilter: "ALL",
};

const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    addDiary: (state, action: PayloadAction<Omit<DiaryEntry, "id" | "liked">>) => {
      state.entries.unshift({
        id: Date.now(),
        ...action.payload,
        liked: false,
      });
    },
    editDiary: (
      state,
      action: PayloadAction<{
        id: number;
        title: string;
        body: string;
        mood: string;
      }>
    ) => {
      const entry = state.entries.find((item) => item.id === action.payload.id);
      if (entry) {
        entry.title = action.payload.title;
        entry.body = action.payload.body;
        entry.preview = action.payload.body.slice(0, 100);
        entry.mood = action.payload.mood;
      }
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const entry = state.entries.find((item) => item.id === action.payload);
      if (entry) {
        entry.liked = !entry.liked;
      }
    },
    deleteDiary: (state, action: PayloadAction<number>) => {
      state.entries = state.entries.filter((item) => item.id !== action.payload);
    },
    deleteAllDiaries: (state) => {
      state.entries = [];
    },
    clearAllFavorites: (state) => {
      state.entries.forEach((item) => {
        item.liked = false;
      });
    },
    setFilter: (state, action: PayloadAction<"all" | "favorite">) => {
      state.filter = action.payload;
    },
    setMoodFilter: (state, action: PayloadAction<string>) => {
      state.moodFilter = action.payload;
    },
  },
});

export const {
  addDiary,
  editDiary,
  toggleFavorite,
  deleteDiary,
  deleteAllDiaries,
  clearAllFavorites,
  setFilter,
  setMoodFilter,
} = diarySlice.actions;

export default diarySlice.reducer;