import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserResponse } from "@/schema/user.schema";
import { Clipboard, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
  isLoading: boolean;
  tempPassword: string | null;
  onConfirm: () => void;
}

export function ResetPasswordDialog({
  open,
  onOpenChange,
  user,
  isLoading,
  tempPassword,
  onConfirm,
}: Readonly<ResetPasswordDialogProps>) {
  const [copied, setCopied] = useState(false);

  // Debug logging to help troubleshoot
  useEffect(() => {
    console.log("Dialog open:", open);
    console.log("tempPassword:", tempPassword);
  }, [open, tempPassword]);

  const copyToClipboard = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      toast.success("Password copied to clipboard");
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(newState) => {
      // Only close if we're showing the password already or user is canceling
      if (!newState || tempPassword) {
        onOpenChange(newState);
      }
    }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Reset Password for {user?.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {tempPassword
              ? "A temporary password has been generated. Please share this with the user."
              : "This will reset the user's password to a temporary one. They will need to change it on their next login."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {tempPassword && (
          <div className="flex items-center gap-2 my-4">
            <Input
              value={tempPassword}
              readOnly
              className="font-mono"
              data-testid="temp-password-input"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
            >
              <Clipboard className={`h-4 w-4 ${copied ? 'text-green-500' : ''}`} />
            </Button>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel>
            {tempPassword ? "Close" : "Cancel"}
          </AlertDialogCancel>
          {!tempPassword && (
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
