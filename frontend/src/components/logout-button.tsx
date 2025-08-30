import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <Button onClick={handleLogout} variant="outline" className="ml-2">
      Çıkış Yap
    </Button>
  );
}