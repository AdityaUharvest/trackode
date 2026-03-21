import BlogManager from "@/components/BlogManager";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Management | Trackode Admin',
  description: 'AI-powered content engine for managing Trackode articles.',
};

export default function BlogAdminPage() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <BlogManager />
    </div>
  );
}
