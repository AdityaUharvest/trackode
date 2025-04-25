
import DashBoard from '@/components/DashBoard';
import 'react-toastify/dist/ReactToastify.css';
import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Admin Dashboard',
  keywords: ['Trackode', 'Trackode', 'Quiz App in nextjs', 'Admin Dashboard'],
  
  description: 'Dashboard for Admins',
};
export default function Dashboard() {
    return (

      
      <DashBoard />
      
    );
  }
  