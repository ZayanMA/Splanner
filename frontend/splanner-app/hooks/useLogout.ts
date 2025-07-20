import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function useLogout() {
  const router = useRouter();
  const { setAuthenticated } = useAuth();

  function logout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setAuthenticated(false);
      router.push("/login");
    }
  }

  return logout;
}
