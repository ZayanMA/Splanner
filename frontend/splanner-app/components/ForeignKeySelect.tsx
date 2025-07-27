"use client";

import api from "@/lib/api";
import React, { useEffect, useState } from "react";

type Option = {
  id: number | string;
  label: string;
};

interface ForeignKeySelectProps {
  label: string;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  fetchUrl: string;
  placeholder?: string;
  getLabel?: (item: any) => string;
  allowNull?: boolean;
}

export default function ForeignKeySelect({
  label,
  value,
  onChange,
  fetchUrl,
  placeholder = "Select...",
  getLabel = (item) => item.name || item.title || `#${item.id}`,
  allowNull = true,
}: ForeignKeySelectProps) {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await api.get(fetchUrl);
        const data = res.data;
        const formatted = data.map((item: any) => ({
          id: item.id,
          label: getLabel(item),
        }));
        setOptions(formatted);
      } catch (err) {
        console.error("Error fetching FK options:", err);
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
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
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
