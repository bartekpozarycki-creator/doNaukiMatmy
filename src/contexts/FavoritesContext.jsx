import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  CLOUD_SYNC_KEYS,
  isCloudSyncReady,
  loadCloudData,
  markCloudSyncReady,
  mergeFavoriteNotes,
  mergeFavorites,
  readLocalJson,
  saveCloudData,
  writeLocalJson,
} from "@/utils/cloud-sync";

const FavoritesContext = createContext();
const childrenPropType = () => null;

function storageKey(userId) {
  return userId ? `mm_task_favorites_${userId}` : "mm_task_favorites_guest";
}

function notesStorageKey(userId) {
  return userId ? `mm_task_favorite_notes_${userId}` : "mm_task_favorite_notes_guest";
}

function normalizeNotes(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value).filter(
      ([taskId, note]) => taskId && typeof note === "string" && note.trim(),
    ),
  );
}

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteNotes, setFavoriteNotes] = useState({});

  useEffect(() => {
    let cancelled = false;
    const key = storageKey(user?.id);
    const notesKey = notesStorageKey(user?.id);
    const legacyFavorites = readLocalJson("mm_favorites", []);
    const storedFavorites = readLocalJson(key, null);
    const localFavorites = Array.isArray(storedFavorites)
      ? storedFavorites
      : Array.isArray(legacyFavorites)
        ? legacyFavorites
        : [];
    const localNotes = normalizeNotes(readLocalJson(notesKey, {}));

    setFavorites(localFavorites);
    setFavoriteNotes(localNotes);
    writeLocalJson(key, localFavorites);
    writeLocalJson(notesKey, localNotes);

    if (!user?.id) return () => {
      cancelled = true;
    };

    Promise.all([
      loadCloudData(user.id, CLOUD_SYNC_KEYS.FAVORITES),
      loadCloudData(user.id, CLOUD_SYNC_KEYS.FAVORITE_NOTES),
    ])
      .then(([cloudFavorites, cloudNotes]) => {
        if (cancelled) return;

        const mergedFavorites =
          isCloudSyncReady(user.id, CLOUD_SYNC_KEYS.FAVORITES) &&
          Array.isArray(cloudFavorites)
            ? cloudFavorites
            : mergeFavorites(localFavorites, cloudFavorites);
        const mergedNotes =
          isCloudSyncReady(user.id, CLOUD_SYNC_KEYS.FAVORITE_NOTES) &&
          cloudNotes &&
          typeof cloudNotes === "object"
            ? normalizeNotes(cloudNotes)
            : mergeFavoriteNotes(localNotes, cloudNotes);

        setFavorites(mergedFavorites);
        setFavoriteNotes(mergedNotes);
        writeLocalJson(key, mergedFavorites);
        writeLocalJson(notesKey, mergedNotes);

        return Promise.all([
          saveCloudData(user.id, CLOUD_SYNC_KEYS.FAVORITES, mergedFavorites).then(() => {
            markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.FAVORITES);
          }),
          saveCloudData(user.id, CLOUD_SYNC_KEYS.FAVORITE_NOTES, mergedNotes).then(() => {
            markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.FAVORITE_NOTES);
          }),
        ]);
      })
      .catch((error) => {
        console.error("[cloud-sync] favorites", error);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const saveFavorites = useCallback(
    (arr) => {
      setFavorites(arr);
      writeLocalJson(storageKey(user?.id), arr);
      if (user?.id) {
        saveCloudData(user.id, CLOUD_SYNC_KEYS.FAVORITES, arr)
          .then(() => {
            markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.FAVORITES);
          })
          .catch((error) => {
            console.error("[cloud-sync] favorites save", error);
          });
      }
    },
    [user?.id],
  );

  const saveNotes = useCallback(
    (notes) => {
      const normalized = normalizeNotes(notes);
      setFavoriteNotes(normalized);
      writeLocalJson(notesStorageKey(user?.id), normalized);
      if (user?.id) {
        saveCloudData(user.id, CLOUD_SYNC_KEYS.FAVORITE_NOTES, normalized)
          .then(() => {
            markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.FAVORITE_NOTES);
          })
          .catch((error) => {
            console.error("[cloud-sync] favorite notes save", error);
          });
      }
    },
    [user?.id],
  );

  const isFavorite = useCallback(
    (taskId) => favorites.includes(taskId),
    [favorites],
  );

  const getNote = useCallback(
    (taskId) => favoriteNotes[taskId]?.trim() || "",
    [favoriteNotes],
  );

  const hasNote = useCallback(
    (taskId) => Boolean(getNote(taskId)),
    [getNote],
  );

  const setNote = useCallback(
    (taskId, note) => {
      if (!taskId) return;
      const trimmed = note?.trim() || "";
      const next = { ...favoriteNotes };
      if (!trimmed) {
        delete next[taskId];
      } else {
        next[taskId] = trimmed;
      }
      saveNotes(next);
    },
    [favoriteNotes, saveNotes],
  );

  const addFavorite = useCallback(
    (taskId) => {
      if (!taskId || favorites.includes(taskId)) return;
      saveFavorites([...favorites, taskId]);
    },
    [favorites, saveFavorites],
  );

  const removeFavorite = useCallback(
    (taskId) => {
      saveFavorites(favorites.filter((id) => id !== taskId));
      if (favoriteNotes[taskId]) {
        const next = { ...favoriteNotes };
        delete next[taskId];
        saveNotes(next);
      }
    },
    [favorites, favoriteNotes, saveFavorites, saveNotes],
  );

  const toggleFavorite = useCallback(
    (taskId) => {
      if (!taskId) return;
      if (favorites.includes(taskId)) {
        removeFavorite(taskId);
      } else {
        addFavorite(taskId);
      }
    },
    [favorites, addFavorite, removeFavorite],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteNotes,
        isFavorite,
        getNote,
        hasNote,
        setNote,
        addFavorite,
        removeFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

FavoritesProvider.propTypes = {
  children: childrenPropType,
};

export const useFavorites = () => useContext(FavoritesContext);
