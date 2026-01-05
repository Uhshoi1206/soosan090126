
import React, { useState } from 'react';
import { Truck } from '@/models/TruckTypes';
import SectionTitle from '@/components/SectionTitle';

// Brand data interface from CMS
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

interface BrandCategoriesProps {
  trucks: Truck[];
  cmsBrands?: BrandData[];
}

// Normalize brand name: remove Vietnamese diacritics, lowercase, trim
// "Trần Tú" → "tran tu", "HYUNDAI" → "hyundai"
const normalizeBrandName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars except spaces
    .replace(/\s+/g, ' '); // Normalize spaces
};

const BrandCategories = ({ trucks, cmsBrands = [] }: BrandCategoriesProps) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  // Tạo danh sách thương hiệu duy nhất từ sản phẩm
  const getUniqueBrandsFromProducts = () => {
    const map = new Map<string, string>();
    trucks.forEach(truck => {
      const brands = Array.isArray(truck.brand) ? truck.brand : [truck.brand];
      brands.filter(Boolean).forEach(b => {
        const key = normalizeBrandName(String(b));
        if (!key) return;
        if (!map.has(key)) map.set(key, String(b).trim());
      });
    });
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b, 'vi'));
  };

  const productBrands = getUniqueBrandsFromProducts();

  // Merge CMS brands with product brands
  // CMS brands take priority for logo/alt text, product brands fill in missing ones
  const getMergedBrands = (): BrandData[] => {
    const cmsMap = new Map<string, BrandData>();

    // Index CMS brands by normalized name (ignore diacritics & case)
    cmsBrands.forEach(brand => {
      cmsMap.set(normalizeBrandName(brand.name), brand);
    });

    // Merge: use CMS data if available, create basic entry for product-only brands
    const merged: BrandData[] = [];
    const seenKeys = new Set<string>();

    // First, add all CMS brands
    cmsBrands.forEach(brand => {
      merged.push(brand);
      seenKeys.add(normalizeBrandName(brand.name));
    });

    // Then, add product brands not in CMS (using normalized matching)
    productBrands.forEach(brandName => {
      const key = normalizeBrandName(brandName);
      if (!seenKeys.has(key)) {
        merged.push({
          id: key.replace(/\s+/g, '-'),
          name: brandName,
          slug: key.replace(/\s+/g, '-'),
        });
        seenKeys.add(key);
      }
    });

    // Sort by order (CMS brands first), then alphabetically
    return merged.sort((a, b) => {
      // CMS brands with order come first
      const aHasOrder = cmsBrands.some(cb => normalizeBrandName(cb.name) === normalizeBrandName(a.name));
      const bHasOrder = cmsBrands.some(cb => normalizeBrandName(cb.name) === normalizeBrandName(b.name));

      if (aHasOrder && !bHasOrder) return -1;
      if (!aHasOrder && bHasOrder) return 1;

      return a.name.localeCompare(b.name, 'vi');
    });
  };

  const brands = getMergedBrands();

  const handleImageError = (brandName: string) => {
    setFailedImages(prev => new Set(prev).add(brandName));
  };

  // Generate Schema.org structured data for SEO
  const generateSchemaData = () => {
    const brandsWithLogos = brands.filter(b => b.logo);
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Thương Hiệu Nổi Tiếng - Đối Tác Phân Phối Xe Tải, Cẩu, Mooc tại Soosan Motor",
      "description": "Danh sách các thương hiệu xe tải, xe cẩu, sơ mi rơ mooc uy tín được phân phối tại Soosan Motor",
      "numberOfItems": brands.length,
      "itemListElement": brands.map((brand, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Brand",
          "name": brand.name,
          ...(brand.logo && { "logo": brand.logo }),
          ...(brand.description && { "description": brand.description }),
          "url": `https://soosanmotor.com/danh-muc-xe?thuong-hieu=${encodeURIComponent(brand.name)}`
        }
      }))
    };
  };

  return (
    <section
      className="py-16"
      aria-labelledby="brand-section-title"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      {/* Schema.org JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateSchemaData()) }}
      />

      <div className="container mx-auto px-4">
        <SectionTitle
          title="Thương Hiệu Nổi Tiếng"
          description="Chúng tôi phân phối đa dạng các loại phương tiện thương mại (xe tải, xe cẩu, mooc, xe đầu kéo) từ những thương hiệu uy tín, đảm bảo chất lượng và độ tin cậy."
        />

        <nav
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
          aria-label="Danh sách thương hiệu xe"
        >
          {brands.length > 0 ? (
            brands.map((brand, index) => (
              <a
                key={brand.id}
                href={`/danh-muc-xe?thuong-hieu=${encodeURIComponent(brand.name)}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex items-center justify-center border border-gray-100 hover:border-primary/20 group min-h-[120px]"
                title={`Xem các sản phẩm ${brand.name}`}
                aria-label={`Thương hiệu ${brand.name}${brand.country ? ` - ${brand.country}` : ''}`}
                itemScope
                itemType="https://schema.org/Brand"
                itemProp="itemListElement"
              >
                <meta itemProp="position" content={String(index + 1)} />
                <div className="flex flex-col items-center justify-center w-full">
                  {brand.logo && !failedImages.has(brand.name) ? (
                    <img
                      src={brand.logo}
                      alt={brand.logoAlt || `Logo thương hiệu ${brand.name} - Đại lý phân phối chính hãng tại Soosan Motor`}
                      className="w-[120px] h-[60px] object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      width={120}
                      height={60}
                      onError={() => handleImageError(brand.name)}
                      itemProp="logo"
                    />
                  ) : (
                    <div className="w-[120px] h-[60px] flex items-center justify-center">
                      <span
                        className="text-base font-semibold text-gray-700 px-3 py-2 text-center group-hover:text-primary transition-colors"
                        itemProp="name"
                      >
                        {brand.name}
                      </span>
                    </div>
                  )}
                  {brand.logo && !failedImages.has(brand.name) && (
                    <span className="sr-only" itemProp="name">{brand.name}</span>
                  )}
                </div>
              </a>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              Chưa có thương hiệu nào trong danh mục
            </p>
          )}
        </nav>
      </div>
    </section>
  );
};

export default BrandCategories;
