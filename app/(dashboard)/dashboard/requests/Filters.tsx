'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('type', e.target.value);
    } else {
      params.delete('type');
    }
    router.push(`/dashboard/requests?${params.toString()}`);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value) {
      params.set('status', e.target.value);
    } else {
      params.delete('status');
    }
    router.push(`/dashboard/requests?${params.toString()}`);
  };

  return (
    <div className="flex gap-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Tipo</label>
        <select
          className="rounded-md border border-gray-300 px-3 py-2"
          value={searchParams.get('type') || ''}
          onChange={handleTypeChange}
        >
          <option value="">Todos</option>
          <option value="DEPOSIT">Depósitos</option>
          <option value="WITHDRAWAL">Retiros</option>
        </select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Estado</label>
        <select
          className="rounded-md border border-gray-300 px-3 py-2"
          value={searchParams.get('status') || ''}
          onChange={handleStatusChange}
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendientes</option>
          <option value="APPROVED">Aprobados</option>
          <option value="REJECTED">Rechazados</option>
        </select>
      </div>
    </div>
  );
}

