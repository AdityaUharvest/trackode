import DashBoard from '@/components/DashBoard';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from 'next';
// import { useSearchParams } from 'next/navigation';

// Metadata for the page
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  keywords: ['Trackode', 'Quiz App in nextjs', 'Admin Dashboard'],
  description: 'Dashboard for Admins',
};

// Server-side component wrapper
export default function Dashboard({ searchParams }:any) {
  // Default to 'overview' if no tab is provided
  const activeTab = searchParams.tab || 'overview';

  return <DashBoard initialTab={activeTab} />;
}