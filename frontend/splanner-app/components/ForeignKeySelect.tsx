"use client";

import React, { useEffect, useState } from "react";

type Option = {
  id: number | string;
  label: string;
};

interface ForeignKeySelectProps {
  label: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  fetchUrl: string; // e.g., "/api/courses/"
  getLabel?: (item: any) => string; // Optional custom label extractor
  placeholder?: string;
  allowNull?: boolean;
}

export default function ForeignKeySelect({
  label,
  value,
  onChange,
  fetchUrl,
  getLabel = (item) => item.name || item.title || `#${item.id}`,
  placeholder = "Select an option",
  allowNull = true,
}: ForeignKeySelectProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(fetchUrl);
        const data = await res.json();
        const formatted = data.map((item: any) => ({
          id: item.id,
          label: getLabel(item),
        }));
        setOptions(formatted);
      } catch (error) {
        console.error("Failed to fetch foreign key options:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [fetchUrl, getLabel]);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
      <select
        className="p-2 rounded border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        disabled={loading}
      >
        {allowNull && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
