import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  id: string;
  title: string;
  type: 'resume' | 'criteria' | 'other';
  fileName?: string;
  fileSize?: number;
  createdAt: string;
  content?: string;
  selected?: boolean;
  onClick?: () => void;
}

const typeColors = {
  resume: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  criteria: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

const typeLabels = {
  resume: "Resume",
  criteria: "Criteria",
  other: "Document",
};

export function DocumentCard({
  id,
  title,
  type,
  fileName,
  fileSize,
  createdAt,
  content,
  selected = false,
  onClick
}: DocumentCardProps) {
  const typeColor = typeColors[type];
  const typeLabel = typeLabels[type];

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card 
      className={`hover:shadow-md transition-all duration-200 cursor-pointer group ${
        selected ? 'ring-2 ring-primary bg-accent' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-sm leading-tight truncate">{title}</h4>
              <Badge className={`${typeColor} text-xs mt-1`}>
                {typeLabel}
              </Badge>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {fileName && (
          <div className="text-xs text-muted-foreground mb-2">
            {fileName} {fileSize && `• ${formatFileSize(fileSize)}`}
          </div>
        )}
        
        {content && (
          <p className="text-xs text-muted-foreground line-clamp-3 mb-2">
            {content}
          </p>
        )}
        
        <div className="text-xs text-muted-foreground">
          {createdAt}
        </div>
      </CardContent>
    </Card>
  );
}