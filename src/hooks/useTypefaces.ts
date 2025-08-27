import { typeface } from "@/types/typefaces";
import { useEffect, useState } from "react";

interface UseTypefacesOptions {
  search?: string;
  filters?: {
    hasHangul?: boolean;
    has_MONO?: boolean;
    has_SERF?: boolean;
    has_STEN?: boolean;
    has_italic?: boolean;
    has_opsz?: boolean;
    has_slnt?: boolean;
    has_wdth?: boolean;
    supportedLanguages?: string[];
  };
}

interface UseTypefacesReturn {
  typefaces: typeface[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTypefaces(
  options: UseTypefacesOptions = {}
): UseTypefacesReturn {
  const [typefaces, setTypefaces] = useState<typeface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTypefaces = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (options.search) params.append("search", options.search);
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              params.append(key, value.join(","));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }

      const response = await fetch(`/api/typefaces?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch typefaces");

      const data = await response.json();
      setTypefaces(data.typefaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTypefaces();
  }, [options.search, JSON.stringify(options.filters)]);

  return {
    typefaces,
    isLoading,
    error,
    refetch: fetchTypefaces,
  };
}

export function useTypeface(slug: string) {
  const [typeface, setTypeface] = useState<typeface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypeface = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/typefaces/${slug}`);
        if (!response.ok) throw new Error("Failed to fetch typeface");

        const data = await response.json();
        setTypeface(data.typeface);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchTypeface();
    }
  }, [slug]);

  return { typeface, isLoading, error };
}
