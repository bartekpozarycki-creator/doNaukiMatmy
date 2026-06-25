import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/supabase-config.js";
import {
  CLOUD_SYNC_KEYS,
  isCloudSyncReady,
  loadCloudData,
  markCloudSyncReady,
  mergeUserLevel,
  saveCloudData,
} from "@/utils/cloud-sync";

const AuthContext = createContext();
const childrenPropType = () => null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userLevel, setUserLevel] = useState("brak");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    const key = user?.id ? `mm_user_level_${user.id}` : "mm_user_level_guest";
    const stored = localStorage.getItem(key);
    const localLevel = stored || "brak";
    setUserLevel(localLevel);

    if (!user?.id) return () => {
      cancelled = true;
    };

    loadCloudData(user.id, CLOUD_SYNC_KEYS.USER_LEVEL)
      .then((cloudLevel) => {
        if (cancelled) return;
        const merged =
          isCloudSyncReady(user.id, CLOUD_SYNC_KEYS.USER_LEVEL) &&
          typeof cloudLevel === "string" &&
          cloudLevel
            ? cloudLevel
            : mergeUserLevel(localLevel, cloudLevel);
        setUserLevel(merged);
        localStorage.setItem(key, merged);
        return saveCloudData(user.id, CLOUD_SYNC_KEYS.USER_LEVEL, merged).then(() => {
          markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.USER_LEVEL);
        });
      })
      .catch((error) => {
        console.error("[cloud-sync] user level", error);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const login = (sessionUser) => {
    // allow manual override if needed
    setUser(sessionUser);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUserLevel = (level) => {
    const key = user?.id ? `mm_user_level_${user.id}` : "mm_user_level_guest";
    localStorage.setItem(key, level);
    setUserLevel(level);
    if (user?.id) {
      saveCloudData(user.id, CLOUD_SYNC_KEYS.USER_LEVEL, level)
        .then(() => {
          markCloudSyncReady(user.id, CLOUD_SYNC_KEYS.USER_LEVEL);
        })
        .catch((error) => {
          console.error("[cloud-sync] user level save", error);
        });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, userLevel, updateUserLevel }}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: childrenPropType,
};

export const useAuth = () => useContext(AuthContext);
