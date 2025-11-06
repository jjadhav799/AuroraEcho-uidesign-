import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DownloadReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportId: string;
}

export default function DownloadReportDialog({
  open,
  onOpenChange,
  reportId,
}: DownloadReportDialogProps) {
  const [sections, setSections] = useState({
    context: true,
    keywords: true,
    metadata: true,
    extractedText: true,
    tags: true,
    confidenceScore: true,
  });
  const [passwordProtect, setPasswordProtect] = useState(false);
  const [encryptPdf, setEncryptPdf] = useState(false);
  const [password, setPassword] = useState("");
  const [fileName, setFileName] = useState(`${reportId}-report`);
  const [watermarkType, setWatermarkType] = useState("none");
  const [customWatermark, setCustomWatermark] = useState("");

  const handleSectionChange = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleDownload = () => {
    console.log("Downloading report with settings:", {
      sections,
      passwordProtect,
      encryptPdf,
      password,
      fileName,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-card shadow-lg rounded-lg p-6">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl">Download Report</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="space-y-6 py-6 px-1">
            {/* Report Template */}
            <div className="bg-card p-6 rounded-lg shadow-sm border space-y-3">
              <h3 className="font-semibold text-base">Report Template</h3>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Report</SelectItem>
                  <SelectItem value="detailed">Detailed Analysis</SelectItem>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="compliance">Compliance Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Formatting Options */}
            <div className="bg-card p-6 rounded-lg shadow-sm border space-y-4">
              <h3 className="font-semibold text-base">Formatting Options</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select defaultValue="en">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select defaultValue="arial">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="arial">Arial</SelectItem>
                      <SelectItem value="times">Times New Roman</SelectItem>
                      <SelectItem value="calibri">Calibri</SelectItem>
                      <SelectItem value="helvetica">Helvetica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-2">
                  <Label>Page Orientation</Label>
                  <Select defaultValue="portrait">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Sections to Include */}
            <div className="bg-card p-6 rounded-lg shadow-sm border space-y-4">
              <h3 className="font-semibold text-base">Sections to Include</h3>
              
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="context"
                    checked={sections.context}
                    onCheckedChange={() => handleSectionChange("context")}
                  />
                  <Label htmlFor="context" className="cursor-pointer font-normal">
                    Context
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="keywords"
                    checked={sections.keywords}
                    onCheckedChange={() => handleSectionChange("keywords")}
                  />
                  <Label htmlFor="keywords" className="cursor-pointer font-normal">
                    Keywords
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metadata"
                    checked={sections.metadata}
                    onCheckedChange={() => handleSectionChange("metadata")}
                  />
                  <Label htmlFor="metadata" className="cursor-pointer font-normal">
                    Metadata
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="extractedText"
                    checked={sections.extractedText}
                    onCheckedChange={() => handleSectionChange("extractedText")}
                  />
                  <Label htmlFor="extractedText" className="cursor-pointer font-normal">
                    Extracted Text
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="tags"
                    checked={sections.tags}
                    onCheckedChange={() => handleSectionChange("tags")}
                  />
                  <Label htmlFor="tags" className="cursor-pointer font-normal">
                    Tags
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="confidenceScore"
                    checked={sections.confidenceScore}
                    onCheckedChange={() => handleSectionChange("confidenceScore")}
                  />
                  <Label htmlFor="confidenceScore" className="cursor-pointer font-normal">
                    Confidence Score
                  </Label>
                </div>
              </div>
            </div>

            {/* Security & Watermark Options */}
            <div className="grid grid-cols-2 gap-6">
              {/* Security Options */}
              <div className="bg-card p-6 rounded-lg shadow-sm border space-y-4">
                <h3 className="font-semibold text-base">Security Options</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password-protect" className="cursor-pointer font-normal">
                      Password Protect
                    </Label>
                    <Switch
                      id="password-protect"
                      checked={passwordProtect}
                      onCheckedChange={setPasswordProtect}
                    />
                  </div>

                  {passwordProtect && (
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <Label htmlFor="encrypt-pdf" className="cursor-pointer font-normal">
                      Encrypt PDF
                    </Label>
                    <Switch
                      id="encrypt-pdf"
                      checked={encryptPdf}
                      onCheckedChange={setEncryptPdf}
                    />
                  </div>
                </div>
              </div>

              {/* Watermark Options */}
              <div className="bg-card p-6 rounded-lg shadow-sm border space-y-4">
                <h3 className="font-semibold text-base">Watermark</h3>
                <Select value={watermarkType} onValueChange={setWatermarkType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Watermark</SelectItem>
                    <SelectItem value="confidential">Confidential</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="internal">Internal Use Only</SelectItem>
                    <SelectItem value="custom">Custom Watermark</SelectItem>
                  </SelectContent>
                </Select>
                
                {watermarkType === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customWatermark" className="text-sm">Custom Watermark Text</Label>
                    <Input
                      id="customWatermark"
                      value={customWatermark}
                      onChange={(e) => setCustomWatermark(e.target.value)}
                      placeholder="Enter custom watermark text"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Output Settings */}
            <div className="bg-card p-6 rounded-lg shadow-sm border space-y-4">
              <h3 className="font-semibold text-base">Output Settings</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fileName">File Name</Label>
                  <Input
                    id="fileName"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Enter file name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Download Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="docx">DOCX</SelectItem>
                      <SelectItem value="xlsx">XLSX</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDownload}>
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
