// app/json-viewer/page.tsx
import type { Metadata } from 'next';
import JsonViewer from './components/JsonViewer';

// Metadata for SEO
export const metadata: Metadata = {
  title: 'JSON Viewer | Interactive JSON Visualization Tool',
  description: 'Free online JSON viewer and formatter with syntax highlighting, collapsible tree view, and copy functionality. Visualize, format, and analyze JSON data easily.',
  keywords: 'JSON viewer, JSON formatter, JSON parser, JSON tree view, JSON visualization',
  openGraph: {
    title: 'JSON Viewer | Interactive JSON Visualization Tool',
    description: 'Free online JSON viewer and formatter with syntax highlighting, collapsible tree view, and copy functionality.',
    type: 'website',
    locale: 'en_US',
    siteName: 'JSON Viewer Tool',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Viewer | Interactive JSON Visualization Tool',
    description: 'Free online JSON viewer and formatter with syntax highlighting and tree view.',
  },
  alternates: {
    canonical: 'https://yourdomain.com/json-viewer',
  },
};

// Structured data for rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'JSON Viewer',
  description: 'Interactive JSON visualization and formatting tool',
  applicationCategory: 'DeveloperApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  featureList: [
    'JSON syntax highlighting',
    'Collapsible tree view',
    'Copy functionality',
    'JSON validation',
    'Pretty printing'
  ]
};

export default function JsonViewerPage() {
  return (
    <>
      {/* Inject structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <main className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12">
        <div className="container mx-auto px-4">
          {/* Semantic HTML structure */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              JSON Viewer
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Visualize and format JSON data with our interactive viewer. Features include syntax highlighting,
              collapsible tree view, and easy copy functionality.
            </p>
          </header>

          <section aria-label="JSON Viewer Tool" className="max-w-4xl mx-auto">
            <JsonViewer />
          </section>

          <footer className="mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
            <p>
              Tips: Click on values to copy them, use the expand/collapse arrows to navigate, 
              and hover over objects to see additional options.
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}
