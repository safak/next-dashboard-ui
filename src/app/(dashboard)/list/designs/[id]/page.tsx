import DesignDetailClientPage from './DesignDetailClientPage';
import { getDesignById } from '@/lib/data';

export default async function DesignDetailPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10);
  const design = await getDesignById(id);

  if (!design) {
    return <div>Design not found</div>;
  }

  return <DesignDetailClientPage design={design} />;
}
