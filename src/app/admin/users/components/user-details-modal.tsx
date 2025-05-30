import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserResponse } from "@/schema/user.schema"
import { Calendar, Mail, Shield } from "lucide-react"
import { format } from "date-fns"
import { useQuery } from "@tanstack/react-query"
import api from "@/utils/axios"

interface UserDetailsModalProps {
  user: UserResponse | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsModal({ user, open, onOpenChange }: Readonly<UserDetailsModalProps>) {
  const { data: activities } = useQuery({
    queryKey: ['user-ratings', user?.id],
    queryFn: async () => {
      if (!user?.id) return []
      const response = await api.get(`/users/${user.id}/ratings`)
      return response.data
    },
    enabled: !!user,
  })

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-6">
          {/* User profile section */}
          <div className="flex items-start gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.image_url ?? undefined} />
              <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>
          </div>

          {/* User details grid */}
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Registered on {format(new Date(user.created_at), 'PPP')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <span>Role: <span className="capitalize">{user.role ?? 'User'}</span></span>
            </div>
          </div>

          {/* Activity history */}
          {activities && activities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
              <div className="space-y-2">
                {activities.map((activity: any) => (
                  <div key={activity.id} className="text-sm">
                    <p>Rated {activity.item_id} with {activity.value} stars</p>
                    <p className="text-muted-foreground">
                      {format(new Date(activity.created_at), 'PPp')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
