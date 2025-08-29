"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { getPoliceReportUrl } from "@/actions/mechanicform";

export function PoliceReportDownload({ path }: { path: string }) {
    const { getToken } = useAuth();

    const handleDownload = async () => {
        try {
            const token = await getToken({ template: "supabase" });
            if (!token) {
                toast.error("User authentication failed. Please sign in again.");
                return;
            }

            const signedUrl = await getPoliceReportUrl(path, token);

            // Force browser to download
            const link = document.createElement("a");
            link.href = signedUrl;
            link.download = path.split("/").pop() || "police_report.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error(err);
            toast.error("Failed to download police report");
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex items-center gap-2"
        >
            <Download className="h-4 w-4" /> Download Police Report
        </Button>
    );
}
