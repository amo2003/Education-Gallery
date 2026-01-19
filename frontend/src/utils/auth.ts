export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const getUserRole = (): string | null => {
  const user = localStorage.getItem("user");
  if (!user) return null;

  try {
    return JSON.parse(user).role ?? null;
  } catch {
    return null;
  }
};

export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
