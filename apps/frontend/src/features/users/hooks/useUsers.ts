// src/features/users/hooks/useUsers.ts

import { useAuthUserProfile } from "@/features/auth/hooks/use-authUser";
import { clientFetch } from "@/lib/api/client-fetch";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserProfileDto } from "@vivero/shared";

export const userProfileQueryKeys = {
  all: (currentUserId: string) => ["users", currentUserId] as const,
  byUserName: (currentUserId: string, username: string) =>
    [
      ...userProfileQueryKeys.all(currentUserId),
      "byUserName",
      username,
    ] as const,
  byTenantId: (currentUserId: string, tenantId: string) =>
    [
      ...userProfileQueryKeys.all(currentUserId),
      "byTenantId",
      tenantId,
    ] as const,
};

export const useUsers = () => {
  const { userProfile } = useAuthUserProfile();
  const currentUserId = userProfile?.id || "anonymous";
  return useQuery<UserProfileDto[]>({
    queryKey: userProfileQueryKeys.all(currentUserId),
    queryFn: () =>
      clientFetch<UserProfileDto[]>("users/all", { method: "GET" }),
    enabled: true,
    retry: 1, // Retry once to account for transient network issues
  });
};

export const useUsersByUserName = (username: string) => {
  const { userProfile } = useAuthUserProfile();
  const currentUserId = userProfile?.id || "anonymous";
  return useQuery<UserProfileDto | null>({
    queryKey: userProfileQueryKeys.byUserName(currentUserId, username),
    queryFn: () => {
      return clientFetch<UserProfileDto | null>(`users/username/${username}`, {
        method: "GET",
      });
    },
    enabled: !!username,
    retry: 1, // Retry once to account for transient network issues
  });
};

export const useUsersByTenantId = (tenantId: string) => {
  const { userProfile } = useAuthUserProfile();
  const currentUserId = userProfile?.id || "anonymous";
  return useQuery<UserProfileDto[]>({
    queryKey: userProfileQueryKeys.byTenantId(currentUserId, tenantId),
    queryFn: () => {
      return clientFetch<UserProfileDto[]>(`users/tenant/${tenantId}`, {
        method: "GET",
      });
    },
    enabled: !!tenantId,
    retry: 1, // Retry once to account for transient network issues
  });
};
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfileDto,
    Error,
    Omit<UserProfileDto, "id" | "createdAt" | "updatedAt">
  >({
    mutationFn: async (userData) => {
      return clientFetch<UserProfileDto>("users", {
        method: "POST",
        body: JSON.stringify(userData),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserProfileDto,
    Error,
    { id: string; userUpdate: Partial<UserProfileDto> }
  >({
    mutationFn: async ({ id, userUpdate }) => {
      return clientFetch<UserProfileDto>(`users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(userUpdate),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      await clientFetch(`users/${userId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
