import React from 'react';
import { CompareProvider } from '@/contexts/CompareContextAstro';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToTop from '../ScrollToTop';
import { Toaster } from '../ui/toaster';
import Hero from '../Hero';
import VehicleCarousel from './VehicleCarousel';
import BrandCategories from './BrandCategories';
import ContactSection from './ContactSection';
import BlogSection from './BlogSection';
import WeightCategories from './WeightCategories';
import TestimonialSection from './TestimonialSection';
import { Truck } from '@/models/TruckTypes';
import type { Banner } from '../BannerCarousel';
import type { SiteSettings } from '@/types/siteSettings';

interface BrandData {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  logoAlt?: string;
  description?: string;
  country?: string;
  website?: string;
}

interface HomePageWithProviderProps {
  featuredTrucks: Truck[];
  specializedCranes: Truck[];
  semiTrailers: Truck[];
  tractors: Truck[];
  trucks: Truck[];
  sortedPosts: any[];
  categoryMap: any;
  categoryInfoMap: any;
  extraCategories: any[];
  enabledTypes: string[];
  banners?: Banner[];
  siteSettings?: Partial<SiteSettings>;
  cmsBrands?: BrandData[];
}

const HomePageWithProvider: React.FC<HomePageWithProviderProps> = ({
  featuredTrucks,
  specializedCranes,
  semiTrailers,
  tractors,
  trucks,
  sortedPosts,
  categoryMap,
  categoryInfoMap,
  extraCategories,
  enabledTypes,
  banners,
  siteSettings,
  cmsBrands
}) => {
  const isTypeEnabled = (type: string) => enabledTypes.includes(type);
  return (
    <SiteSettingsProvider settings={siteSettings}>
      <CompareProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Hero banners={banners} />

            <div className="w-full overflow-hidden">
              {isTypeEnabled('xe-tai') && (
                <VehicleCarousel
                  vehicles={featuredTrucks}
                  title={categoryInfoMap['xe-tai']?.name || "Xe Tải"}
                  description={categoryInfoMap['xe-tai']?.description || "Các dòng xe tải được nhiều khách hàng tin dùng, đa dạng tải trọng và thương hiệu"}
                  viewAllUrl="/danh-muc-xe?loai-xe=xe-tai"
                  viewAllText={`Xem tất cả ${(categoryInfoMap['xe-tai']?.name || 'xe tải').toLowerCase()}`}
                />
              )}

              {isTypeEnabled('xe-cau') && (
                <VehicleCarousel
                  vehicles={specializedCranes}
                  title={categoryInfoMap['xe-cau']?.name || "Xe Cẩu"}
                  description={categoryInfoMap['xe-cau']?.description || "Các dòng xe cẩu chuyên dụng, đa dạng tải trọng và thương hiệu"}
                  viewAllUrl="/danh-muc-xe?loai-xe=xe-cau"
                  viewAllText={`Xem tất cả ${(categoryInfoMap['xe-cau']?.name || 'xe cẩu').toLowerCase()}`}
                />
              )}

              {isTypeEnabled('mooc') && (
                <VehicleCarousel
                  vehicles={semiTrailers}
                  title={categoryInfoMap['mooc']?.name || "Sơ Mi Rơ Mooc"}
                  description={categoryInfoMap['mooc']?.description || "Các dòng mooc chuyên dụng, đa dạng loại và thương hiệu"}
                  viewAllUrl="/danh-muc-xe?loai-xe=mooc"
                  viewAllText={`Xem tất cả ${(categoryInfoMap['mooc']?.name || 'sơ mi rơ mooc').toLowerCase()}`}
                />
              )}

              {isTypeEnabled('dau-keo') && (
                <VehicleCarousel
                  vehicles={tractors}
                  title={categoryInfoMap['dau-keo']?.name || "Xe Đầu Kéo"}
                  description={categoryInfoMap['dau-keo']?.description || "Các dòng xe đầu kéo, đa dạng công suất và thương hiệu"}
                  viewAllUrl="/danh-muc-xe?loai-xe=dau-keo"
                  viewAllText={`Xem tất cả ${(categoryInfoMap['dau-keo']?.name || 'xe đầu kéo').toLowerCase()}`}
                />
              )}

              {extraCategories.map(cat => (
                isTypeEnabled(cat.data.id) && (
                  <VehicleCarousel
                    key={cat.data.id}
                    vehicles={trucks.filter(t => t.type === cat.data.id)}
                    title={cat.data.name}
                    description={cat.data.description || `Các dòng ${cat.data.name.toLowerCase()} chuyên dụng, đa dạng mẫu mã`}
                    viewAllUrl={`/danh-muc-xe?loai-xe=${cat.data.id}`}
                    viewAllText={`Xem tất cả ${cat.data.name.toLowerCase()}`}
                  />
                )
              ))}

              <div className="bg-gray-50 w-full">
                <WeightCategories />
              </div>

              <BrandCategories trucks={trucks} cmsBrands={cmsBrands} />

              <TestimonialSection products={trucks} />

              <ContactSection />

              <BlogSection
                posts={sortedPosts.slice(0, 6)}
                categories={categoryMap}
                categoryInfoMap={categoryInfoMap}
              />
            </div>
          </main>
          <Footer />
          <ScrollToTop />
          <Toaster />
        </div>
      </CompareProvider>
    </SiteSettingsProvider>
  );
};

export default HomePageWithProvider;

