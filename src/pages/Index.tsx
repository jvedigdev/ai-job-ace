import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { ApplicationCard } from "@/components/ApplicationCard";
import { DocumentCard } from "@/components/DocumentCard";
import { SearchBar } from "@/components/SearchBar";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Settings, FileText, Briefcase, Zap, Home } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

// Define a type for documents that matches the Supabase table structure
type Document = Tables<'documents'>;

// Mock data for demonstration - will be replaced by Supabase data
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

const Index = () => {
  const { supabaseUser, isAuthenticated, loading: authLoading } = useSupabaseAuth();
  const [selectedView, setSelectedView] = useState<"applications" | "documents">("applications");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]); // Use Document type for state

  useEffect(() => {
    const fetchDocuments = async () => {
      if (isAuthenticated && supabaseUser) {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .eq('user_id', supabaseUser.id);

        if (error) {
          console.error("Error fetching documents:", error);
          toast.error("Failed to load documents.");
        } else {
          setDocuments(data || []);
        }
      } else {
        // If not authenticated, clear documents or load mock data if preferred
        setDocuments([]); 
      }
    };

    fetchDocuments();
  }, [isAuthenticated, supabaseUser]);


  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    if (!isAuthenticated || !supabaseUser) {
      toast.error("You need to be signed in to upload documents.");
      return;
    }

    const file = files[0];
    const filePath = `${supabaseUser.id}/${Date.now()}_${file.name}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents') // Ensure you have a bucket named 'documents' in Supabase Storage
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      const fileUrl = publicUrlData.publicUrl;

      const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
          user_id: supabaseUser.id,
          title: file.name.split('.')[0],
          type: 'other', // Default to 'other', can be changed later
          file_name: file.name,
          file_size: file.size,
          file_url: fileUrl,
        })
        .select();

      if (insertError) {
        throw insertError;
      }

      if (data && data.length > 0) {
        setDocuments(prevDocs => [...prevDocs, data[0]]);
        toast.success("Document uploaded successfully!");
      }
    } catch (error: any) {
      console.error("Error uploading document:", error.message);
      toast.error(`Failed to upload document: ${error.message}`);
    }
  };

  const filteredApplications = mockApplications.filter(app =>
    app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDocuments = documents.filter(doc =>
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
      {/* Header - NotebookLM Style */}
      <header className="bg-header border-b">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="text-header-foreground font-medium">AI'll Take That Job</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-white/10" onClick={() => window.location.href = "/"}>
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-white/10">
                <Settings className="w-4 h-4" />
              </Button>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <div className="flex items-center space-x-2">
                  <SignInButton>
                    <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-white/10">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton>
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <SignedIn>
        <div className="bg-background">
          {/* Welcome Section */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-4xl font-bold text-primary mb-2">Welcome to jobs llm</h1>
          </div>
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <div className="lg:w-80 space-y-6">
            {/* Upload Section */}
            <div className="bg-card rounded-lg p-6 border">
              <div className="text-center py-8">
                <Upload className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Click to upload files and drop documents here or select files
                </p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" size="sm" asChild>
                    <span>Select Files</span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={selectedView === "applications" ? "secondary" : "ghost"}
                size="sm"
                className="flex-1"
                onClick={() => setSelectedView("applications")}
              >
                My Applications
              </Button>
              <Button
                variant={selectedView === "documents" ? "secondary" : "ghost"} 
                size="sm"
                className="flex-1"
                onClick={() => setSelectedView("documents")}
              >
                Apply
              </Button>
            </div>

            {/* Selected Documents */}
            {selectedDocuments.length > 0 && (
              <div className="bg-card rounded-lg p-4 border">
                <h3 className="font-medium mb-3">Selected Documents</h3>
                <div className="space-y-2">
                  {selectedDocuments.map(id => {
                    const doc = documents.find(d => d.id === id); // Use 'documents' state
                    return doc ? (
                      <div key={doc.id} className="text-sm p-2 bg-accent rounded flex items-center justify-between">
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
                placeholder="Search"
                className="max-w-md"
              />
            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-muted-foreground">
                  Found {selectedView === "applications" ? filteredApplications.length : filteredDocuments.length} documents
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <FileText className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  Most recent ▼
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
                      createdAt={new Date(doc.created_at).toLocaleDateString()} // Explicitly pass formatted date
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
      </SignedIn>
      
      <SignedOut>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-primary mb-4">AI'll Take That Job</h1>
            <p className="text-muted-foreground mb-8">
              Your AI-powered job application assistant. Sign up to start managing your applications and documents.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <SignUpButton>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Get Started
                </Button>
              </SignUpButton>
              <SignInButton>
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default Index;