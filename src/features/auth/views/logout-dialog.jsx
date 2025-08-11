"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signOut } from "next-auth/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { LogOut } from "lucide-react";

export function LogoutDialog(props) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    const { success, message } = await signOut();

    if (success) {
      router.push("/auth");
    } else {
      toast.error(message);
    }

    setOpen(false);
  };

  const isMobile = useIsMobile();

  return (
    <>
      <Button
        variant="outline"
        className="border-red-500 text-red-500 hover:bg-red-50"
        onClick={() => setOpen(true)}
        {...props}
      >
        {isMobile ? <LogOut /> : "Log out"}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to log out?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Back
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
