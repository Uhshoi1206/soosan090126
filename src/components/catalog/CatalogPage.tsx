import React, { useState, useEffect } from 'react';
import VehicleTypeTabs from './VehicleTypeTabs';
import FilterSidebar from '../FilterSidebar';
import VehicleGrid from './VehicleGrid';
import { Truck, TruckFilters, VehicleType } from '@/models/TruckTypes';
import { useVehicleFiltering } from '@/hooks/useVehicleFiltering';
import { getBoxTypeSlug, getTrailerTypeSlug } from '@/utils/slugify';

interface CatalogPageProps {
  initialVehicles: Truck[];
  initialSearchQuery?: string;
}

const CatalogPage: React.FC<CatalogPageProps> = ({ initialVehicles, initialSearchQuery = '' }) => {
  const [selectedType, setSelectedType] = useState<VehicleType | null>(null);
  const [filters, setFilters] = useState<TruckFilters>({
    brand: null,
    minPrice: null,
    maxPrice: null,
    minWeight: null,
    maxWeight: null,
    vehicleType: null,
    search: initialSearchQuery || null,
    boxType: null,
    trailerType: null
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const typeParam = params.get('loai-xe') as VehicleType | null;
      const brandParam = params.get('thuong-hieu');
      const searchParam = params.get('tim-kiem');
      const minWeightParam = params.get('tai-trong-tu');
      const maxWeightParam = params.get('tai-trong-den');
      const boxTypeParam = params.get('loai-thung');
      const trailerTypeParam = params.get('loai-mooc');

      if (typeParam) {
        setSelectedType(typeParam as VehicleType);
        setFilters(prev => ({ ...prev, vehicleType: typeParam as VehicleType }));
      }

      if (brandParam) {
        setFilters(prev => ({ ...prev, brand: brandParam }));
      }

      if (searchParam) {
        setFilters(prev => ({ ...prev, search: searchParam }));
      }

      if (minWeightParam && maxWeightParam) {
        const minWeight = parseFloat(minWeightParam);
        const maxWeight = parseFloat(maxWeightParam);
        if (!isNaN(minWeight) && !isNaN(maxWeight)) {
          setFilters(prev => ({
            ...prev,
            minWeight: minWeight,
            maxWeight: maxWeight
          }));
        }
      }

      // Đọc boxType từ URL (đã là slug không dấu)
      if (boxTypeParam) {
        setFilters(prev => ({ ...prev, boxType: boxTypeParam }));
      }

      // Đọc trailerType từ URL (đã là slug không dấu)
      if (trailerTypeParam) {
        setFilters(prev => ({ ...prev, trailerType: trailerTypeParam }));
      }
    }
  }, []);

  const handleTypeChange = (type: VehicleType) => {
    setSelectedType(type);
    // Xóa boxType và trailerType khi chuyển sang loại xe khác - người dùng sẽ chọn lại danh mục con nếu cần
    setFilters(prev => ({ ...prev, vehicleType: type, boxType: null, trailerType: null }));

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('loai-xe', type);
      // Xóa loại thùng và loại mooc khỏi URL khi chuyển tab
      params.delete('loai-thung');
      params.delete('loai-mooc');
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleFilterChange = (keyOrFilters: keyof TruckFilters | TruckFilters, value?: any) => {
    let newFilters: TruckFilters;

    if (typeof keyOrFilters === 'object') {
      newFilters = { ...keyOrFilters };
    } else {
      newFilters = { ...filters, [keyOrFilters]: value };
    }

    setFilters(newFilters);

    // Sync selectedType with vehicleType from filters
    if (newFilters.vehicleType !== selectedType) {
      setSelectedType(newFilters.vehicleType);
    }

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();

      if (newFilters.vehicleType) params.set('loai-xe', newFilters.vehicleType);
      if (newFilters.brand) params.set('thuong-hieu', newFilters.brand);
      if (newFilters.search) params.set('tim-kiem', newFilters.search);
      if (newFilters.minWeight !== null && newFilters.maxWeight !== null) {
        params.set('tai-trong-tu', String(newFilters.minWeight));
        params.set('tai-trong-den', String(newFilters.maxWeight));
      }
      if (newFilters.boxType) params.set('loai-thung', newFilters.boxType);
      if (newFilters.trailerType) params.set('loai-mooc', newFilters.trailerType);

      const newUrl = params.toString()
        ? `${window.location.pathname}?${params.toString()}`
        : window.location.pathname;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleResetFilters = () => {
    const emptyFilters: TruckFilters = {
      brand: null,
      minPrice: null,
      maxPrice: null,
      minWeight: null,
      maxWeight: null,
      vehicleType: null,
      search: null,
      boxType: null,
      trailerType: null
    };
    setFilters(emptyFilters);
    setSelectedType(null);

    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', window.location.pathname);
    }
  };

  const { filteredVehicles } = useVehicleFiltering(initialVehicles, selectedType, {
    brand: filters.brand,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    minWeight: filters.minWeight,
    maxWeight: filters.maxWeight,
    search: filters.search,
    boxType: filters.boxType,
    trailerType: filters.trailerType
  });

  return (
    <>
      <VehicleTypeTabs
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
      />

      <div className="flex flex-col lg:flex-row gap-6 mt-8">
        <aside className="lg:w-64 flex-shrink-0">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            vehicles={filteredVehicles}
          />
        </aside>

        <main className="flex-1">
          <VehicleGrid
            vehicles={filteredVehicles}
            initialVehicles={initialVehicles}
            onResetFilters={handleResetFilters}
          />
        </main>
      </div>
    </>
  );
};

export default CatalogPage;
