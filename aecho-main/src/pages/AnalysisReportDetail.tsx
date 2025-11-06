import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Download } from "lucide-react";
import DownloadReportDialog from "@/components/analysis/DownloadReportDialog";

type AnalysisReport = {
  arid: string;
  title: string;
  date: string;
  docs: number;
  score: number;
  responsiveDocs: number;
  projectId: string;
  status: string;
  context: string;
  keywords: string[];
  tags: string[];
  totalSize: string;
  docTypes: string[];
  extractedText: string;
};

const dummyReports: Record<string, AnalysisReport> = {
  "AR-001": {
    arid: "AR-001",
    title: "Q4 Compliance Review",
    date: "2024-01-15 14:30",
    docs: 24,
    score: 87,
    responsiveDocs: 18,
    projectId: "proj-002",
    status: "completed",
    context: "Quarterly compliance review focusing on regulatory requirements and internal policy adherence. Analysis covers financial reporting, data protection measures, and operational compliance across multiple departments.",
    keywords: ["compliance", "regulatory", "audit", "financial reporting", "data protection", "policy adherence"],
    tags: ["Q4-2024", "Compliance", "Financial", "Regulatory", "High-Priority"],
    totalSize: "156 MB",
    docTypes: ["PDF", "DOCX", "XLSX"],
    extractedText: `COMPLIANCE REVIEW SUMMARY - Q4 2024

Executive Summary:
This comprehensive review examines compliance across all operational units for the fourth quarter of 2024. Key findings indicate strong adherence to regulatory frameworks with minor improvements needed in documentation practices.

Key Findings:
1. Financial Reporting: All quarterly reports submitted on time with 98% accuracy rate
2. Data Protection: GDPR compliance maintained across all departments
3. Internal Policies: 95% adherence rate to updated internal guidelines
4. Risk Assessment: Medium-risk items identified in procurement process

Recommendations:
- Enhance documentation standardization in procurement
- Implement additional training for data handling procedures
- Review and update legacy policy documents by Q1 2025

Detailed Analysis:
The analysis covered 24 documents across multiple departments including Finance, Operations, Legal, and IT. Document review revealed consistent compliance with external regulatory requirements...`
  },
  "AR-002": {
    arid: "AR-002",
    title: "Contract Analysis - Smith Ltd",
    date: "2024-01-14 10:15",
    docs: 12,
    score: 92,
    responsiveDocs: 10,
    projectId: "proj-001",
    status: "completed",
    context: "Comprehensive contract review for Smith Ltd partnership agreement. Analysis includes terms and conditions, liability clauses, payment terms, and compliance with industry standards.",
    keywords: ["contract", "terms", "liability", "payment", "partnership", "agreement"],
    tags: ["Smith-Ltd", "Contract", "Legal", "Partnership", "High-Value"],
    totalSize: "45 MB",
    docTypes: ["PDF", "DOCX"],
    extractedText: `CONTRACT ANALYSIS REPORT - SMITH LTD

Contract Overview:
Multi-year partnership agreement between parties dated January 2024. Total contract value of $2.5M over 36 months with quarterly payment terms.

Key Terms Identified:
- Service Level Agreement: 99.5% uptime guarantee
- Payment Schedule: Net 30 days from invoice date
- Termination Clause: 90-day notice period required
- Liability Cap: Limited to contract value

Risk Assessment:
Low to medium risk profile. Standard industry terms with appropriate safeguards in place. Intellectual property clauses clearly defined...`
  }
};

export default function AnalysisReportDetail() {
  const { arid } = useParams<{ arid: string }>();
  const navigate = useNavigate();
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  
  const report = arid ? dummyReports[arid] : null;

  if (!report) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Report not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDownload = () => {
    setDownloadDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Analysis
      </Button>

      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <CardTitle className="text-3xl">{report.arid}</CardTitle>
                <Badge 
                  variant={report.status === "completed" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {report.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{report.date}</span>
                <span>•</span>
                <span>Confidence Score: <span className="font-semibold text-foreground">{report.score}%</span></span>
              </div>
            </div>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column - Context, Keywords, Tags */}
        <div className="md:col-span-2 space-y-6">
          {/* Context Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Context</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {report.context}
              </p>
            </CardContent>
          </Card>

          {/* Keywords Used */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Keywords Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {report.keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags Used */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags Used</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {report.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Extracted Text */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Extracted Text</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                  {report.extractedText}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Document Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-lg">Document Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Number of Documents</p>
                <p className="text-2xl font-bold">{report.docs}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Size</p>
                <p className="text-xl font-semibold">{report.totalSize}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Document Types</p>
                <div className="flex flex-wrap gap-2">
                  {report.docTypes.map((type, index) => (
                    <Badge key={index} variant="default">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-1">Responsive Documents</p>
                <p className="text-xl font-semibold">{report.responsiveDocs} / {report.docs}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DownloadReportDialog
        open={downloadDialogOpen}
        onOpenChange={setDownloadDialogOpen}
        reportId={report.arid}
      />
    </div>
  );
}
