import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth(required = false) {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    setAuthenticated(!!token);

    if (required && !token) {
      router.push("/login");
    }
  }, [required, router]);

  return { authenticated };
}
