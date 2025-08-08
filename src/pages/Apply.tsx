import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Zap, Settings } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Apply = () => {
  const { supabaseUser, isAuthenticated } = useSupabaseAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    role: "",
    jobUrl: "",
    status: "draft",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !supabaseUser) {
      toast.error("You need to be signed in to create applications.");
      return;
    }

    if (!formData.title || !formData.company || !formData.role) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('applications')
        .insert({
          user_id: supabaseUser.id,
          title: formData.title,
          company: formData.company,
          role: formData.role,
          job_url: formData.jobUrl || null,
          status: formData.status,
          notes: formData.notes || null,
        })
        .select();

      if (error) {
        throw error;
      }

      toast.success("Application created successfully!");
      
      // Reset form
      setFormData({
        title: "",
        company: "",
        role: "",
        jobUrl: "",
        status: "draft",
        notes: "",
      });

      // Redirect to home page after a brief delay
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      
    } catch (error: any) {
      console.error("Error creating application:", error.message);
      toast.error(`Failed to create application: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => window.location.href = "/"}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">AI'll Take That Job</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      <SignedIn>
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Application</h1>
            <p className="text-muted-foreground">Add a new job application to track your progress</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Application Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="e.g. TechCorp Inc."
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role/Position *</Label>
                  <Input
                    id="role"
                    placeholder="e.g. Full Stack Developer"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobUrl">Job URL (optional)</Label>
                  <Input
                    id="jobUrl"
                    type="url"
                    placeholder="https://company.com/careers/job-id"
                    value={formData.jobUrl}
                    onChange={(e) => handleInputChange("jobUrl", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about this application..."
                    rows={4}
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={isSubmitting} className="flex-1">
                    {isSubmitting ? "Creating..." : "Create Application"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => window.location.href = "/"}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <h1 className="text-2xl font-bold mb-4">Sign in required</h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to create job applications.
            </p>
            <Button onClick={() => window.location.href = "/"}>
              Go to Sign In
            </Button>
          </div>
        </div>
      </SignedOut>
    </div>
  );
};

export default Apply;