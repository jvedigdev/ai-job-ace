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
  draft: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  applied: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  interview: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  offer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

const cardBackgrounds = [
  "bg-card-orange text-white",
  "bg-card-brown text-white", 
  "bg-card-gray text-white",
  "bg-card-green text-white",
  "bg-card-red text-white",
  "bg-card-blue text-white",
  "bg-card-purple text-white",
  "bg-card-yellow text-white",
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
  const cardBg = cardBackgrounds[Math.abs(id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % cardBackgrounds.length];
  const statusColor = statusColors[status as keyof typeof statusColors] || statusColors.draft;

  return (
    <Card className={`hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden ${cardBg}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg leading-tight text-white mb-1">{title}</h3>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-white hover:bg-white/20">
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
        <Badge className={`${statusColor} text-xs font-medium w-fit`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-white">
        <div className="flex items-center text-sm text-white/80">
          <Building2 className="w-4 h-4 mr-2" />
          <span>{company}</span>
        </div>
        <div className="text-sm text-white/90 font-medium">
          {role}
        </div>
        {appliedDate && (
          <div className="flex items-center text-xs text-white/70">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{appliedDate} • 4 sources</span>
          </div>
        )}
        {lastUpdate && (
          <div className="text-xs text-white/70">
            Last update: {lastUpdate}
          </div>
        )}
      </CardContent>
    </Card>
  );
}