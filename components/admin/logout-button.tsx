"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { logoutAdmin } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [pendente, iniciar] = useTransition();

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pendente}
      onClick={() => iniciar(() => logoutAdmin())}
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  );
}
