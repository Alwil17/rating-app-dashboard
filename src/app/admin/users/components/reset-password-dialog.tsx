"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { UserResponse } from "@/schema/user.schema";
import { Loader2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type ResetPasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
  isLoading: boolean;
  tempPassword: string | null;
  onConfirm: () => void;
};

export function ResetPasswordDialog({
  open,
  onOpenChange,
  user,
  isLoading,
  tempPassword,
  onConfirm,
}: ResetPasswordDialogProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  if (!user) return null;

  const handleCopyPassword = () => {
    if (tempPassword) {
      navigator.clipboard.writeText(tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('users.resetPassword.title', { name: user.name })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {tempPassword 
              ? t('users.resetPassword.success')
              : t('users.resetPassword.confirmation')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        {tempPassword ? (
          <div className="bg-muted p-3 rounded-md flex items-center justify-between">
            <code className="text-sm font-mono">{tempPassword}</code>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCopyPassword} 
              className="h-8 w-8 p-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">{t('common.copy')}</span>
            </Button>
          </div>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel>
            {tempPassword ? t('common.close') : t('common.cancel')}
          </AlertDialogCancel>
          {!tempPassword && (
            <Button onClick={onConfirm} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('users.resetPassword.confirm')}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
