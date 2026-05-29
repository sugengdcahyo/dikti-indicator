"use client";

import * as React from "react";

export type BreadcrumbLink = {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
};

export type PageHeaderProps = {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbLink[];
  actions?: React.ReactNode;
};

export function PageHeader({ title, description, breadcrumbs, actions }: PageHeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div style={{ flex: 1, minWidth: "280px" }}>


        {/* Title */}
        <h1 style={{ fontSize: "1.75rem", fontWeight: 400, color: "var(--cds-text-primary)", margin: 0 }}>
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p style={{ fontSize: "0.875rem", color: "var(--cds-text-secondary)", marginTop: "0.25rem", margin: "0.25rem 0 0 0" }}>
            {description}
          </p>
        )}
      </div>

      {/* Header Actions (Right aligned) */}
      {actions && (
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {actions}
        </div>
      )}
    </div>
  );
}
