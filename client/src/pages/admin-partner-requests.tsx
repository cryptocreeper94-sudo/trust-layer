import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { 
  ArrowLeft, Users, CheckCircle, XCircle, Clock, 
  Mail, Building2, User, Globe, FileText, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import type { PartnerAccessRequest } from "@shared/schema";

export default function AdminPartnerRequests() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: requests = [], isLoading } = useQuery<PartnerAccessRequest[]>({
    queryKey: ["/api/partner/requests"],
    queryFn: async () => {
      const res = await fetch("/api/partner/requests");
      if (!res.ok) throw new Error("Failed to fetch requests");
      const data = await res.json();
      return data.requests || [];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      setProcessingId(id);
      const res = await fetch(`/api/partner/requests/${id}/approve`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to approve request");
      return res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Request Approved",
        description: `Access code ${data.accessCode} sent to partner.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partner/requests"] });
      setProcessingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve request",
        variant: "destructive",
      });
      setProcessingId(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      setProcessingId(id);
      const res = await fetch(`/api/partner/requests/${id}/reject`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to reject request");
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Request Rejected",
        description: "The partner has been notified.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/partner/requests"] });
      setProcessingId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject request",
        variant: "destructive",
      });
      setProcessingId(null);
    },
  });

  const pendingRequests = requests.filter(r => r.status === "pending");
  const approvedRequests = requests.filter(r => r.status === "approved");
  const rejectedRequests = requests.filter(r => r.status === "rejected");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white p-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/analytics">
            <Button variant="outline" size="icon" className="border-white/10 text-white/60 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              Partner Access Requests
            </h1>
            <p className="text-white/60 mt-1">Review and manage partnership inquiries</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-amber-950/20 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-amber-400 text-2xl">{pendingRequests.length}</CardTitle>
              <CardDescription className="text-white/50">Pending Review</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-emerald-950/20 border-emerald-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-emerald-400 text-2xl">{approvedRequests.length}</CardTitle>
              <CardDescription className="text-white/50">Approved</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-red-950/20 border-red-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-red-400 text-2xl">{rejectedRequests.length}</CardTitle>
              <CardDescription className="text-white/50">Rejected</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-white/50">Loading requests...</div>
        ) : requests.length === 0 ? (
          <Card className="bg-slate-800/50 border-white/10">
            <CardContent className="py-12 text-center">
              <Users className="w-12 h-12 mx-auto mb-4 text-white/20" />
              <p className="text-white/50">No partner access requests yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {requests.map((request, i) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="bg-slate-800/50 border-white/10 hover:border-white/20 transition-colors" data-testid={`partner-request-${request.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          {getStatusBadge(request.status)}
                          <span className="text-white/40 text-sm">
                            {new Date(request.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-2 text-white/80">
                            <Building2 className="w-4 h-4 text-cyan-400" />
                            <span className="font-semibold">{request.studioName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <User className="w-4 h-4 text-purple-400" />
                            <span>{request.contactName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/80">
                            <Mail className="w-4 h-4 text-pink-400" />
                            <span>{request.email}</span>
                          </div>
                          {request.website && (
                            <div className="flex items-center gap-2 text-white/80">
                              <Globe className="w-4 h-4 text-emerald-400" />
                              <a href={request.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-cyan-400">
                                {request.website}
                              </a>
                            </div>
                          )}
                        </div>

                        {request.previousProjects && (
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Previous Projects</p>
                            <p className="text-white/70 text-sm">{request.previousProjects}</p>
                          </div>
                        )}

                        {request.interestReason && (
                          <div>
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Interest Reason</p>
                            <p className="text-white/70 text-sm">{request.interestReason}</p>
                          </div>
                        )}

                        {request.accessCode && (
                          <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span className="text-emerald-400 font-mono">{request.accessCode}</span>
                          </div>
                        )}
                      </div>

                      {request.status === "pending" && (
                        <div className="flex lg:flex-col gap-2 shrink-0">
                          <Button
                            onClick={() => approveMutation.mutate(request.id)}
                            disabled={processingId === request.id}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white"
                            data-testid={`approve-${request.id}`}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => rejectMutation.mutate(request.id)}
                            disabled={processingId === request.id}
                            variant="outline"
                            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                            data-testid={`reject-${request.id}`}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
