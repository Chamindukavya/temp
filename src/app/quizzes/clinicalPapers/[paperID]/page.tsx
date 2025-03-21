import ClinicalPaperDetail from './ClinicalPaperDetail';

// Simple server component that passes the paperID to the client component
export default function Page({ params }: any) {
  return <ClinicalPaperDetail paperID={params.paperID} />;
}

// Optional: Generate static params for any known paperIDs at build time
// If you don't need this, you can remove it
export async function generateStaticParams() {
  // You would typically fetch these from your database or API
  // This is just a placeholder
  return [];
}
