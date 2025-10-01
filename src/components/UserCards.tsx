// components/UserCards.tsx
'use client';
import { analyticsAPI } from '@/lib/api';
import { useEffect, useState } from 'react';

interface UserCardsProps {
  type: "Compliant" | "Technicians" | "Resolved Compliant" | "Resident";
}

const UserCards = ({ type }: UserCardsProps) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await analyticsAPI.getDashboardData();
        const counts = data.userCards;
        
        switch(type) {
          case "Compliant":
            setCount(counts.complaints);
            break;
          case "Technicians":
            setCount(counts.technicians);
            break;
          case "Resolved Compliant":
            setCount(counts.resolved);
            break;
          case "Resident":
            setCount(counts.residents);
            break;
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type]);

  if (loading) return <div className="...">Loading...</div>;

  return (
    <div className="p-4 rounded-lg flex-1 min-w-[130px] bg-white shadow-md">
      <span className={`text-sm font-medium
        ${type === "Compliant" && "text-red-500"}
        ${type === "Technicians" && "text-blue-500"} 
        ${type === "Resolved Compliant" && "text-green-500"}
        ${type === "Resident" && "text-purple-500"}
      `}>
        {type}
      </span>
      <div className="text-2xl font-bold">{count}</div>
    </div>
  );
};

export default UserCards;