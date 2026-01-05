import React, { useState } from 'react';
import { CompareProvider } from '@/contexts/CompareContextAstro';
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext';
import Header from '../Header';
import Footer from '../Footer';
import ScrollToTop from '../ScrollToTop';
import { Toaster } from '../ui/toaster';
import { Truck, getVehicleTypeName, getBoxTypeName, getTrailerTypeName, getStockStatusInfo } from '@/models/TruckTypes';
import { BlogPost } from '@/models/BlogPost';
import { OptimizedImage } from '@/components/ui/optimized-image';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TruckActions from './TruckActions';
import ProductDetailTabs from './ProductDetailTabs';
import TruckItem from '@/components/TruckItem';
import CostEstimator from './CostEstimator';
import useRelatedBlogForTruck from '@/hooks/useRelatedBlogForTruck';
import { CalendarDays, Clock } from 'lucide-react';
import type { SiteSettings } from '@/types/siteSettings';
import { getBoxTypeSlug, getTrailerTypeSlug } from '@/utils/slugify';

interface ProductDetailWithProviderProps {
  truck: Truck;
  relatedTrucks: Truck[];
  allBlogPosts: BlogPost[];
  siteSettings?: Partial<SiteSettings>;
  categoryName?: string;
}

const ProductDetailWithProvider: React.FC<ProductDetailWithProviderProps> = ({
  truck,
  relatedTrucks,
  allBlogPosts = [],
  siteSettings,
  categoryName
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);

  const allImages = [truck.thumbnailUrl, ...(truck.images || [])].filter(Boolean);

  // Get related blog posts using the hook
  const relatedBlogPosts = useRelatedBlogForTruck(truck, allBlogPosts).slice(0, 3);

  const renderBrands = () => {
    if (Array.isArray(truck.brand)) {
      return truck.brand.join(' / ');
    }
    return truck.brand;
  };

  const getDefaultFeatures = () => {
    if (truck.features && truck.features.length > 0) {
      return truck.features;
    }

    if (truck.boxType === 'đông-lạnh') {
      return [
        'Thùng đông lạnh được sản xuất theo tiêu chuẩn châu Âu',
        'Hệ thống làm lạnh mạnh mẽ với máy lạnh hiệu suất cao',
        'Cách nhiệt Polyurethane chuẩn quốc tế, độ dày 80mm',
        'Thùng composite nguyên khối, chống thấm nước tuyệt đối',
        'Khả năng duy trì nhiệt độ -18°C đến +5°C tùy nhu cầu'
      ];
    }

    return [];
  };

  // Use categoryName from CMS if provided, otherwise fallback to getVehicleTypeName
  const vehicleTypeName = categoryName || getVehicleTypeName(truck.type);
  const boxTypeName = truck.boxType ? getBoxTypeName(truck.boxType) : '';
  const trailerTypeName = truck.trailerType ? getTrailerTypeName(truck.trailerType) : '';

  return (
    <SiteSettingsProvider settings={siteSettings}>
      <CompareProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <div className="container mx-auto px-4 py-8">
              {/* Breadcrumbs - Simple style like reference */}
              <div className="flex items-center mb-6 text-sm">
                <a href="/" className="text-gray-600 hover:text-primary">Trang chủ</a>
                <span className="mx-2">›</span>
                <a href="/danh-muc-xe" className="text-gray-600 hover:text-primary">Danh mục xe</a>
                <span className="mx-2">›</span>
                <a href={`/danh-muc-xe?loai-xe=${truck.type}`} className="text-gray-600 hover:text-primary">
                  {vehicleTypeName}
                </a>
                {truck.boxType && (
                  <>
                    <span className="mx-2">›</span>
                    <a href={`/danh-muc-xe?loai-xe=${truck.type}&loai-thung=${getBoxTypeSlug(truck.boxType)}`} className="text-gray-600 hover:text-primary">
                      {boxTypeName}
                    </a>
                  </>
                )}
                {truck.trailerType && (
                  <>
                    <span className="mx-2">›</span>
                    <a href={`/danh-muc-xe?loai-xe=${truck.type}&loai-mooc=${getTrailerTypeSlug(truck.trailerType)}`} className="text-gray-600 hover:text-primary">
                      {trailerTypeName}
                    </a>
                  </>
                )}
                <span className="mx-2">›</span>
                <span className="font-medium">{truck.name}</span>
              </div>

              {/* Product Main Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                {/* Left: Product Images & Video Gallery */}
                <div>
                  <div className="mb-4 border rounded-lg overflow-hidden aspect-[4/3] bg-gray-50">
                    {showVideo && truck.videoUrl ? (
                      <iframe
                        src={truck.videoUrl.replace('watch?v=', 'embed/').split('&')[0]}
                        title={`Video giới thiệu ${truck.name}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    ) : (
                      <OptimizedImage
                        src={allImages[activeImageIndex]}
                        alt={truck.name}
                        className="w-full h-full object-contain"
                        useCase="product"
                      />
                    )}
                  </div>
                  <div className="flex space-x-2 overflow-x-auto pb-2">
                    {allImages.map((image, i) => (
                      <button
                        key={i}
                        onClick={() => { setActiveImageIndex(i); setShowVideo(false); }}
                        className={`border-2 rounded-md overflow-hidden flex-shrink-0 w-20 h-20 transition-all ${!showVideo && activeImageIndex === i ? 'border-primary' : 'border-transparent'}`}
                      >
                        <OptimizedImage
                          src={image}
                          alt={`${truck.name} - hình ${i + 1}`}
                          className="w-full h-full object-contain bg-gray-50"
                          useCase="thumbnail"
                        />
                      </button>
                    ))}
                    {/* Video Thumbnail */}
                    {truck.videoUrl && (() => {
                      // Extract YouTube video ID from URL
                      const videoIdMatch = truck.videoUrl.match(/(?:watch\?v=|embed\/|youtu\.be\/)([^&?/]+)/);
                      const videoId = videoIdMatch ? videoIdMatch[1] : '';
                      const youtubeThumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '';

                      return (
                        <button
                          onClick={() => setShowVideo(true)}
                          className={`rounded-lg overflow-hidden flex-shrink-0 w-20 h-20 transition-all duration-300 relative group hover:scale-105 ${showVideo ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
                        >
                          {/* YouTube Thumbnail */}
                          <img
                            src={youtubeThumbnail}
                            alt="Video"
                            className="w-full h-full object-cover"
                          />
                          {/* Gradient overlay - subtle dark at bottom */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                          {/* Apple-style glassmorphism play button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-9 h-9 rounded-full bg-white/25 backdrop-blur-md flex items-center justify-center shadow-lg group-hover:bg-white/40 transition-all duration-300 group-hover:scale-110">
                              <svg
                                className="w-4 h-4 text-white ml-0.5 drop-shadow-sm"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      );
                    })()}
                  </div>
                </div>

                {/* Right: Product Info */}
                <div>
                  {/* Stock Status Badge & Shipping Badge - Prominent display */}
                  {(() => {
                    const stockInfo = getStockStatusInfo(truck.stockStatus);
                    return (
                      <div className="mb-4 flex flex-wrap gap-2">
                        {stockInfo.show && (
                          <Badge className={`${stockInfo.className} text-sm px-4 py-1.5 animate-pulse`}>
                            {stockInfo.label === 'Sẵn hàng' ? '✓ ' : ''}{stockInfo.label}
                          </Badge>
                        )}
                        <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm px-4 py-1.5">
                          🚚 Giao hàng toàn quốc
                        </Badge>
                      </div>
                    );
                  })()}

                  <div className="flex flex-wrap gap-2 mb-3">
                    {truck.isNew && (
                      <Badge className="bg-blue-500 hover:bg-blue-600">Mới</Badge>
                    )}
                    {truck.isHot && (
                      <Badge className="bg-primary hover:bg-red-700">Hot</Badge>
                    )}
                    {Array.isArray(truck.brand) ? (
                      truck.brand.map((b, index) => (
                        <Badge key={index} variant="outline">{b}</Badge>
                      ))
                    ) : (
                      <Badge variant="outline">{truck.brand}</Badge>
                    )}
                    {truck.boxType && (
                      <Badge variant="outline" className="bg-blue-50">{boxTypeName}</Badge>
                    )}
                    {truck.trailerType && (
                      <Badge variant="outline" className="bg-green-50">{trailerTypeName}</Badge>
                    )}
                  </div>

                  <h1 className="text-3xl font-bold">{truck.name}</h1>

                  <div className="text-2xl font-bold text-primary mb-6">
                    {truck.priceText}
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-4 mb-6">
                    <h2 className="text-lg font-bold">Thông số cơ bản:</h2>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-gray-600 text-sm">Thương hiệu</div>
                        <div className="font-medium">{renderBrands()}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-gray-600 text-sm">Tải trọng</div>
                        <div className="font-medium">{truck.weightText}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-gray-600 text-sm">Kích thước tổng thể</div>
                        <div className="font-medium">{truck.dimensions}</div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="text-gray-600 text-sm">Xuất xứ</div>
                        <div className="font-medium">{truck.origin || 'Hàn Quốc'}</div>
                      </div>
                      {truck.boxType === 'đông-lạnh' && truck.coolingBox && (
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="text-gray-600 text-sm">Nhiệt độ làm lạnh</div>
                          <div className="font-medium">{truck.coolingBox.temperatureRange || '-18°C đến +5°C'}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {getDefaultFeatures().length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-bold mb-2">Tính năng nổi bật:</h2>
                      <ul className="list-disc list-inside space-y-1">
                        {getDefaultFeatures().map((feature, index) => (
                          <li key={index} className="text-gray-700">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <TruckActions truck={truck} />
                </div>
              </div>

              <ProductDetailTabs truck={truck} />

              {/* Cost Estimator Section */}
              <section className="my-12" id="cost-estimator-section">
                <CostEstimator truck={truck} />
              </section>

              {relatedTrucks.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedTrucks.map((relatedTruck) => (
                      <TruckItem key={relatedTruck.id} truck={relatedTruck} />
                    ))}
                  </div>
                </div>
              )}

              {/* Related Blog Posts Section */}
              {relatedBlogPosts.length > 0 && (
                <section className="mt-16">
                  <div className="rounded-2xl shadow-xl border border-blue-100 bg-gradient-to-b from-blue-50 via-white to-white px-2 py-7 mb-2">
                    <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center uppercase tracking-wider">
                      Bài viết liên quan về {truck.name}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {relatedBlogPosts.map((post) => {
                        const categorySlug = post.category || 'uncategorized';
                        const postUrl = `/danh-muc-bai-viet/${categorySlug}/${post.slug}`;

                        // Calculate reading time (assuming 200 words per minute)
                        const wordCount = post.content.split(/\s+/).length;
                        const readingTime = Math.ceil(wordCount / 200);

                        return (
                          <a key={post.id} href={postUrl} className="group">
                            <article className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col h-full border border-blue-100">
                              <div className="aspect-video w-full overflow-hidden relative">
                                <img
                                  src={post.image || 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
                                  alt={post.title}
                                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                                  loading="lazy"
                                />
                              </div>
                              <div className="p-4 flex-grow flex flex-col">
                                <div className="flex items-center text-xs text-blue-700 mb-1 gap-2">
                                  <CalendarDays className="h-4 w-4 mr-1 inline-block" />
                                  {new Date(post.publishDate).toLocaleDateString('vi-VN')}
                                  <span className="mx-2">•</span>
                                  <Clock className="h-4 w-4 mr-1 inline-block" />
                                  {readingTime} phút đọc
                                </div>
                                <h3 className="font-bold text-lg mb-2 group-hover:text-blue-700 line-clamp-2 transition-colors">
                                  {post.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                                  {post.excerpt || post.description}
                                </p>
                                <span className="mt-auto inline-block px-4 py-1 text-blue-700 font-semibold bg-blue-50 rounded-full text-xs hover:bg-blue-100 transition">
                                  Đọc chi tiết
                                </span>
                              </div>
                            </article>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </section>
              )}
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

export default ProductDetailWithProvider;

