import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Import authOptions from the correct location
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client'; // Import Role enum

// This page will act as a server-side router based on auth status and role
export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    // Not logged in, redirect to sign-in page
    console.log('No session found, redirecting to /sign-in');
    redirect('/sign-in');
  } else {
    // Logged in, check role and redirect
    const userRole = session.user.role; // Role comes from augmented Session type
    console.log(`Session found for user ${session.user.email}, role: ${userRole}. Redirecting...`);

    if (userRole === Role.ADMIN) {
      redirect('/admin');
    } else if (userRole === Role.EMPLOYEE) {
      redirect('/employee');
    } else {
      // Fallback or handle unexpected roles - maybe redirect to sign-in or an error page
      console.warn(`Unexpected user role: ${userRole}. Redirecting to /sign-in.`);
      redirect('/sign-in');
    }
  }

  // This part should ideally not be reached due to redirects,
  // but returning null or a loading indicator is good practice.
  return null;
}
