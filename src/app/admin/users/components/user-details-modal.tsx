"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { UserResponse } from "@/schema/user.schema";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Mail, Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

type UserDetailsModalProps = {
  user: UserResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserDetailsModal({ user, open, onOpenChange }: UserDetailsModalProps) {
  const { t } = useTranslation();

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('users.details.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image_url ?? undefined} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex items-center text-muted-foreground">
                <Shield className="h-4 w-4 mr-1" />
                <span className="capitalize">{user.role || "user"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{t('users.details.memberSince', { date: format(new Date(user.created_at), 'PPP') })}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
