import { NextRequest, NextResponse } from 'next/server';
import { getAllTypefaces, getTypefacesWithFilter, searchTypefaces } from '@/api/typefaces';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const hasHangul = searchParams.get('hasHangul');
    const has_MONO = searchParams.get('has_MONO');
    const has_SERF = searchParams.get('has_SERF');
    const has_STEN = searchParams.get('has_STEN');
    const has_italic = searchParams.get('has_italic');
    const has_opsz = searchParams.get('has_opsz');
    const has_slnt = searchParams.get('has_slnt');
    const has_wdth = searchParams.get('has_wdth');
    const supportedLanguages = searchParams.get('supportedLanguages');

    let typefaces;

    if (search) {
      typefaces = await searchTypefaces(search);
    } else if (hasHangul || has_MONO || has_SERF || has_STEN || has_italic || has_opsz || has_slnt || has_wdth || supportedLanguages) {
      const filters: any = {};
      
      if (hasHangul) filters.hasHangul = hasHangul === 'true';
      if (has_MONO) filters.has_MONO = has_MONO === 'true';
      if (has_SERF) filters.has_SERF = has_SERF === 'true';
      if (has_STEN) filters.has_STEN = has_STEN === 'true';
      if (has_italic) filters.has_italic = has_italic === 'true';
      if (has_opsz) filters.has_opsz = has_opsz === 'true';
      if (has_slnt) filters.has_slnt = has_slnt === 'true';
      if (has_wdth) filters.has_wdth = has_wdth === 'true';
      if (supportedLanguages) filters.supportedLanguages = supportedLanguages.split(',');
      
      typefaces = await getTypefacesWithFilter(filters);
    } else {
      typefaces = await getAllTypefaces();
    }

    return NextResponse.json({ typefaces });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch typefaces' },
      { status: 500 }
    );
  }
}
```

```typescript:src/app/api/typefaces/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTypefaceBySlug } from '@/api/typefaces';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const typeface = await getTypefaceBySlug(params.slug);
    
    if (!typeface) {
      return NextResponse.json(
        { error: 'Typeface not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ typeface });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch typeface' },
      { status: 500 }
    );
  }
}
```

```typescript:src/app/api/typefaces/featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedTypefaces } from '@/api/typefaces';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    
    const typefaces = await getFeaturedTypefaces(limit);
    
    return NextResponse.json({ typefaces });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured typefaces' },
      { status: 500 }
    );
  }
}
```

## 4. Create a client-side hook for easy consumption:

```typescript:src/hooks/useTypefaces.ts
import { useState, useEffect } from 'react';
import { Typeface } from '@/api/typefaces';

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
  typefaces: Typeface[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useTypefaces(options: UseTypefacesOptions = {}): UseTypefacesReturn {
  const [typefaces, setTypefaces] = useState<Typeface[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTypefaces = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (options.search) params.append('search', options.search);
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              params.append(key, value.join(','));
            } else {
              params.append(key, String(value));
            }
          }
        });
      }
      
      const response = await fetch(`/api/typefaces?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch typefaces');
      
      const data = await response.json();
      setTypefaces(data.typefaces);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
  const [typeface, setTypeface] = useState<Typeface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTypeface = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/typefaces/${slug}`);
        if (!response.ok) throw new Error('Failed to fetch typeface');
        
        const data = await response.json();
        setTypeface(data.typeface);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
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
```

## Usage Examples:

```typescript
// In your components
import { useTypefaces, useTypeface } from '@/hooks/useTypefaces';

// Get all typefaces
function TypefaceList() {
  const { typefaces, isLoading, error } = useTypefaces();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {typefaces.map(typeface => (
        <div key={typeface._id}>{typeface.name}</div>
      ))}
    </div>
  );
}

// Get typeface by slug
function TypefaceDetail({ slug }: { slug: string }) {
  const { typeface, isLoading, error } = useTypeface(slug);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!typeface) return <div>Typeface not found</div>;
  
  return <div>{typeface.name}</div>;
}

// Filtered typefaces
function FilteredTypefaces() {
  const { typefaces, isLoading } = useTypefaces({
    filters: {
      hasHangul: true,
      has_italic: true
    }
  });
  
  // ... render filtered typefaces
}
```

This setup gives you:
- **Server-side fetching** with proper error handling
- **Type-safe** interfaces for your data
- **Flexible filtering** and search capabilities
- **Next.js API routes** for client-side consumption
- **Custom hooks** for easy integration in your components
- **Performance optimized** with proper caching and error handling

The API endpoints will be available at:
- `/api/typefaces` - Get all typefaces with optional filtering
- `/api/typefaces/[slug]` - Get a specific typeface by slug
- `/api/typefaces/featured` - Get featured typefaces

