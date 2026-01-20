// src/features/auth/providers/AuthProvider.tsx
"use client";

import { createContext, useContext } from "react";
import { useAuthUserProfile } from "../hooks/use-authUser";

type UserProfileContextType = ReturnType<typeof useAuthUserProfile>;

const AuthUserProfileContext = createContext<UserProfileContextType | null>(
  null,
);

export function AuthUserProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const authUserProfile = useAuthUserProfile();

  return (
    <AuthUserProfileContext.Provider value={authUserProfile}>
      {children}
    </AuthUserProfileContext.Provider>
  );
}

export const useAuthUserProfileContext = () => {
  const context = useContext(AuthUserProfileContext);
  if (!context) {
    throw new Error(
      "useAuthUserProfileContext must be used within an AuthUserProfileProvider",
    );
  }
  return context;
};
