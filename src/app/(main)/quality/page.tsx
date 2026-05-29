"use client";

import { QualitySummary } from "@/components/dashboard/quality-summary";
import { useDashboardStore } from "@/store/dashboard-store";
import { PageHeader } from "@/components/layout/page-header";

export default function QualityPage() {
  const profile = useDashboardStore((s) => s.profile);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <PageHeader
        title="Data Quality Overview"
        description="Ringkasan kualitas data, klasifikasi kolom, dan deteksi missing values untuk memastikan kesiapan analitik."
        breadcrumbs={[
          { label: "Data" },
          { label: "Kualitas Data", isCurrentPage: true },
        ]}
      />
      <QualitySummary profile={profile} />
    </div>
  );
}
