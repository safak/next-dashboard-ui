import { fetchCompanys } from '@/lib/data'; // Assuming fetchCompanys will be created
import CompanysClientPage from './CompanysClientPage'; // Assuming CompanysClientPage will be created
import { ITEMS_PER_PAGE } from '@/lib/constants';

export const metadata = {
  title: 'Companys',
};

// Company type based on Prisma schema
interface Company {
  id: number; // Changed from string to number
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Add other fields if needed for display later
}

interface CompanysPageProps {
  searchParams?: {
    query?: string;
    page?: string;
    // Add other potential search params like status, etc.
  };
}

export default async function CompanysPage({ searchParams }: CompanysPageProps) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  // Add logic for other filters if needed

  // Fetch company data using the function from lib/data.ts
  const { companys, totalPages, totalItems } = await fetchCompanys({
    query,
    currentPage,
    itemsPerPage: ITEMS_PER_PAGE,
    // Pass other filters here if needed in the future
  });

  // Placeholder data until fetchCompanys is implemented - Removed
  // const companys: Company[] = [];
  // const totalPages = 1;
  // const totalItems = 0; // Added placeholder totalItems

  return (
    <CompanysClientPage
      initialCompanys={companys}
      totalPages={totalPages}
      totalItems={totalItems} // Pass totalItems
      // Pass initial filter values if needed
    />
  );
}
