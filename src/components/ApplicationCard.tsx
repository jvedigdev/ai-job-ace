import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Building2, Briefcase } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ApplicationCardProps {
  id: string;
  title: string;
  company: string;
  role: string;
  status: string;
  appliedDate?: string;
  lastUpdate?: string;
  notes?: string;
  gradient?: string;
}

const statusColors = {
  draft: "bg-muted text-muted-foreground",
  applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  interview: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  offer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const cardGradients = [
  "bg-gradient-to-br from-blue-500 to-blue-600",
  "bg-gradient-to-br from-purple-500 to-purple-600",
  "bg-gradient-to-br from-orange-500 to-orange-600",
  "bg-gradient-to-br from-green-500 to-green-600",
  "bg-gradient-to-br from-red-500 to-red-600",
];

export function ApplicationCard({
  id,
  title,
  company,
  role,
  status,
  appliedDate,
  lastUpdate,
  notes,
  gradient
}: ApplicationCardProps) {
  const gradientClass = gradient || cardGradients[Math.abs(id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % cardGradients.length];
  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.draft;

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-lg ${gradientClass} flex items-center justify-center mb-3`}>
            <Briefcase className="w-6 h-6 text-white" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <h3 className="font-semibold text-lg leading-tight mb-1">{title}</h3>
          <Badge className={`${statusColor} text-xs font-medium mb-2`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Building2 className="w-4 h-4 mr-2" />
          <span>{company}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{role}</span>
        </div>
        {appliedDate && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Applied {appliedDate}</span>
          </div>
        )}
        {lastUpdate && (
          <div className="text-xs text-muted-foreground">
            Last update: {lastUpdate}
          </div>
        )}
        {notes && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
            {notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}