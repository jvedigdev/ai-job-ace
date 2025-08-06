import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "@/components/ApplicationCard";
import { DocumentCard } from "@/components/DocumentCard";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Settings, FileText, Briefcase, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Mock data for demonstration
const mockApplications = [
  {
    id: "1",
    title: "Logic Gates: NOT, AND, OR, NAND...",
    company: "TechCorp",
    role: "Senior Software Engineer",
    status: "interview",
    appliedDate: "Feb 24, 2025",
    lastUpdate: "3 days ago",
    notes: "Completed technical interview, waiting for final round.",
  },
  {
    id: "2", 
    title: "Two-Dimensional Motion and...",
    company: "StartupXYZ",
    role: "Frontend Developer",
    status: "applied",
    appliedDate: "Dec 15, 2024",
    lastUpdate: "1 week ago",
  },
  {
    id: "3",
    title: "One-Dimensional Motion: Kinematics",
    company: "BigTech Inc",
    role: "Full Stack Developer", 
    status: "draft",
    lastUpdate: "2 weeks ago",
    notes: "Need to customize cover letter for this position.",
  },
  {
    id: "4",
    title: "Magnetic Fields and Ampere's Law",
    company: "DataCorp",
    role: "Data Scientist",
    status: "rejected",
    appliedDate: "Jan 10, 2025",
    lastUpdate: "1 month ago",
  },
];

const mockDocuments = [
  {
    id: "1",
    title: "Software Engineer Resume 2025",
    type: "resume" as const,
    fileName: "resume_v3.pdf",
    fileSize: 245000,
    createdAt: "Feb 20, 2025",
    content: "Experienced software engineer with 5+ years in full-stack development...",
  },
  {
    id: "2",
    title: "Job Search Criteria",
    type: "criteria" as const,
    createdAt: "Feb 18, 2025",
    content: "Looking for remote-friendly companies, strong engineering culture, growth opportunities...",
  },
  {
    id: "3",
    title: "Portfolio Projects Summary",
    type: "other" as const,
    fileName: "portfolio.pdf",
    fileSize: 1200000,
    createdAt: "Feb 15, 2025",
    content: "Collection of key projects including e-commerce platform, task management app...",
  },
];

const Index = () => {
  const [selectedView, setSelectedView] = useState<"applications" | "documents">("applications");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  const filteredApplications = mockApplications.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocuments = mockDocuments.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.content?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments(prev =>
      prev.includes(id) ? prev.filter(docId => docId !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI'll Take That Job</h1>
                <p className="text-sm text-muted-foreground">Your AI-powered job application notebook</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Application
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-80 space-y-6">
            {/* Upload Section */}
            <div className="bg-card rounded-lg p-4 border">
              <div className="text-center py-6">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Click to upload files and drop documents here or select files
                </p>
                <Button variant="outline" size="sm">
                  Select Files
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="space-y-2">
              <Button
                variant={selectedView === "applications" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedView("applications")}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                My Applications
              </Button>
              <Button
                variant={selectedView === "documents" ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setSelectedView("documents")}
              >
                <FileText className="w-4 h-4 mr-2" />
                All Documents
              </Button>
            </div>

            {/* Selected Documents */}
            {selectedDocuments.length > 0 && (
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-medium mb-3">Selected Documents</h3>
                <div className="space-y-2">
                  {selectedDocuments.map(id => {
                    const doc = mockDocuments.find(d => d.id === id);
                    return doc ? (
                      <div key={id} className="text-sm p-2 bg-accent rounded flex items-center justify-between">
                        <span className="truncate">{doc.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {doc.type}
                        </Badge>
                      </div>
                    ) : null;
                  })}
                </div>
                <Separator className="my-3" />
                <Button size="sm" className="w-full">
                  <Zap className="w-4 h-4 mr-2" />
                  Generate Application
                </Button>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search Bar */}
            <div className="mb-6">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={selectedView === "applications" ? "Search applications..." : "Search documents..."}
              />
            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedView === "applications" ? "My Applications" : "All Documents"}
                </h2>
                <p className="text-muted-foreground">
                  {selectedView === "applications" 
                    ? `Found ${filteredApplications.length} applications`
                    : `Found ${filteredDocuments.length} documents`
                  }
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Most recent
                </Button>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {selectedView === "applications" 
                ? filteredApplications.map(app => (
                    <ApplicationCard key={app.id} {...app} />
                  ))
                : filteredDocuments.map(doc => (
                    <DocumentCard 
                      key={doc.id} 
                      {...doc} 
                      selected={selectedDocuments.includes(doc.id)}
                      onClick={() => toggleDocumentSelection(doc.id)}
                    />
                  ))
              }
            </div>

            {/* Empty State */}
            {((selectedView === "applications" && filteredApplications.length === 0) ||
              (selectedView === "documents" && filteredDocuments.length === 0)) && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  {selectedView === "applications" ? (
                    <Briefcase className="w-8 h-8 text-muted-foreground" />
                  ) : (
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery 
                    ? `No ${selectedView} found` 
                    : `No ${selectedView} yet`
                  }
                </h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery 
                    ? `Try adjusting your search terms`
                    : selectedView === "applications" 
                      ? "Create your first job application to get started"
                      : "Upload documents to begin building your job application toolkit"
                  }
                </p>
                {!searchQuery && (
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {selectedView === "applications" ? "New Application" : "Upload Document"}
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
