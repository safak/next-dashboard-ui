import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next'; // Import getServerSession
import { authOptions } from '@/lib/auth'; // Import authOptions (re-exported from lib/auth.ts)
import { prisma } from '@/lib/prisma'; // Use named import
import EmployeesClientPage from './EmployeesClientPage'; // We will create this next

const EmployeePage = async () => {
  const session = await getServerSession(authOptions); // Use getServerSession

  // 1. Check if user is logged in and is an ADMIN
  if (!session?.user || session.user.role !== 'ADMIN') {
    // Redirect non-admins or unauthenticated users
    // Or show an unauthorized message
    // redirect('/sign-in'); // Or redirect to an unauthorized page
    return (
      <div className='p-4'>
        <h1 className='text-xl font-bold text-red-600'>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // 2. Fetch all users if the user is an ADMIN
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc', // Or order by name, username, etc.
    },
  });

  // 3. Pass users to a client component (to be created)
  return <EmployeesClientPage users={users} />;
};

export default EmployeePage;
