import { prisma } from '@/lib/prisma';
import { ITEMS_PER_PAGE } from '@/lib/constants';
// Import User for the relation
import { Prisma, Company, Design, User } from '@prisma/client'; // Removed Employee import
import DesignsClientPage from './DesignsClientPage'; // Import the client component

// Update DesignList type to use User
type DesignList = Design & { company: Company; user: User | null };

// Define the expected searchParams structure for clarity
interface DesignsPageSearchParams {
  query?: string;
  status?: string;
  userId?: string; // Filter by User ID
  createdStart?: string;
  createdEnd?: string;
  updatedStart?: string;
  updatedEnd?: string;
  page?: string;
  limit?: string;
}

// This is the main Server Component for the page
const DesignsPage = async ({ searchParams }: { searchParams?: DesignsPageSearchParams }) => {
  // --- Data Fetching Logic (moved from the old page) ---
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || ITEMS_PER_PAGE;

  // Get individual filter params
  const query = searchParams?.query || '';
  const statusFilter = searchParams?.status || '';
  const userIdFilter = searchParams?.userId || ''; // Changed from employeeIdFilter
  const createdStartFilter = searchParams?.createdStart || '';
  const createdEndFilter = searchParams?.createdEnd || '';
  const updatedStartFilter = searchParams?.updatedStart || '';
  const updatedEndFilter = searchParams?.updatedEnd || '';

  // Define the base where condition using AND logic
  const whereConditions: Prisma.DesignWhereInput[] = [];

  // Add specific filters
  if (statusFilter) {
    whereConditions.push({ status: { equals: statusFilter, mode: 'insensitive' } });
  }
  // Filter by userId (string)
  if (userIdFilter) {
    whereConditions.push({ userId: userIdFilter });
  }
  const createdAtFilter: Prisma.DateTimeFilter = {};
  if (createdStartFilter) createdAtFilter.gte = new Date(createdStartFilter);
  if (createdEndFilter) createdAtFilter.lte = new Date(createdEndFilter);
  if (Object.keys(createdAtFilter).length > 0) {
    whereConditions.push({ createdAt: createdAtFilter });
  }
  const updatedAtFilter: Prisma.DateTimeFilter = {};
  if (updatedStartFilter) updatedAtFilter.gte = new Date(updatedStartFilter);
  if (updatedEndFilter) updatedAtFilter.lte = new Date(updatedEndFilter);
  if (Object.keys(updatedAtFilter).length > 0) {
    whereConditions.push({ updatedAt: updatedAtFilter });
  }

  // Add general query filter
  if (query) {
    const queryAsInt = parseInt(query, 10);
    const isQueryInt = !isNaN(queryAsInt);
    const queryConditions: Prisma.DesignWhereInput[] = [
      { company: { name: { contains: query, mode: 'insensitive' } } },
      { status: { contains: query, mode: 'insensitive' } }, // Removed extra brace here
      // Query against the related User's name
      { user: { name: { contains: query, mode: 'insensitive' } } },
      { templateName: { contains: query, mode: 'insensitive' } },
    ];
    if (isQueryInt) {
      queryConditions.push({ companyId: queryAsInt });
    }
    whereConditions.push({ OR: queryConditions });
  }

  // Combine all conditions with AND
  const whereCondition: Prisma.DesignWhereInput =
    whereConditions.length > 0 ? { AND: whereConditions } : {};

  // Fetch users for the filter dropdown (instead of employees)
  const users = await prisma.user.findMany({
    select: { id: true, name: true, username: true }, // Select relevant User fields
    orderBy: { name: 'asc' }, // Or username
  });

  // Fetch total count
  const totalItems = await prisma.design.count({ where: whereCondition });
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Fetch designs for the current page, include user instead of employee
  const designs = await prisma.design.findMany({
    where: whereCondition,
    include: {
      company: true,
      user: true, // Changed from employee: true
    },
    skip: (currentPage - 1) * itemsPerPage,
    take: itemsPerPage,
    orderBy: { createdAt: 'desc' }, // Example sorting
  });
  // --- End of Data Fetching Logic ---

  // Render the Client Component, passing fetched data and searchParams as props
  // DesignsClientPage will need to accept 'users' instead of 'employees'
  return (
    <DesignsClientPage
      designs={designs as DesignList[]} // Pass designs typed with User relation
      users={users} // Pass the user list for filters
      totalItems={totalItems}
      totalPages={totalPages}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      searchParams={searchParams || {}} // Pass searchParams down
    />
  );
};

export default DesignsPage;
