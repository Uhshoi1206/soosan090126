import { defineCollection, z } from 'astro:content';

// Product Categories Collection Schema
const categoriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    keywords: z.array(z.string()).optional(),
    isHidden: z.boolean().default(false),
    order: z.number().nullable().optional(),
  }),
});

// Blog Categories Collection Schema
const blogCategoriesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
    isHidden: z.boolean().default(false),
    order: z.number().nullable().optional(),
  }),
});

// Banners Collection Schema
const bannersCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    highlightText: z.string().optional(),
    description: z.string(),
    backgroundImage: z.string(),
    ctaPrimaryText: z.string(),
    ctaPrimaryLink: z.string(),
    ctaSecondaryText: z.string(),
    ctaSecondaryLink: z.string(),
    isActive: z.boolean().default(true),
    order: z.number().default(0),
  }),
});

// Brands Collection Schema (SEO-optimized for homepage "Thương Hiệu Nổi Tiếng" section)
const brandsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    logo: z.string().optional(),
    logoAlt: z.string().optional(),
    description: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    country: z.string().optional(),
    website: z.string().optional(),
    foundedYear: z.number().optional(),
    order: z.number().default(0),
    isActive: z.boolean().default(true),
  }),
});

// Products Collection Schema
const productsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // Basic Information
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    brand: z.union([z.string(), z.array(z.string())]),
    type: z.string(), // category key (primary)
    secondaryType: z.string().optional(), // secondary category key (for products that appear in multiple categories)
    model: z.string().optional(),

    // Pricing
    price: z.number().nullable().optional(),
    priceText: z.string().optional(),

    // Dimensions & Weight
    weightText: z.string(),
    weight: z.number(),
    length: z.number(),
    width: z.number(),
    height: z.number(),
    dimensions: z.string(),

    // Images
    thumbnailUrl: z.string(),
    images: z.array(z.string()),

    // Status Flags
    isNew: z.boolean().optional(),
    isHot: z.boolean().optional(),
    isHidden: z.boolean().default(false),
    stockStatus: z.enum(['in-stock', 'out-of-stock', 'pre-order', 'discontinued']).default('in-stock'),
    origin: z.string().optional(),

    // Descriptions
    description: z.string().optional(),
    detailedDescription: z.string().optional(),
    features: z.array(z.string()).optional(),

    // Media
    videoUrl: z.string().optional(), // YouTube video URL for Video Schema

    // Engine Specifications
    engineModel: z.string().optional(),
    engineCapacity: z.string().optional(),
    enginePower: z.string().optional(),
    engineTorque: z.string().optional(),
    emissionStandard: z.string().optional(),
    engineType: z.string().optional(),
    fuel: z.string().optional(),

    // Transmission & Drivetrain
    transmission: z.string().optional(),
    transmissionType: z.string().optional(),
    clutchType: z.string().optional(),

    // Dimensions Details
    wheelbase: z.number().optional(),
    wheelbaseText: z.string().optional(),
    insideDimension: z.string().optional(),
    groundClearance: z.number().optional(),
    wheelTrack: z.string().optional(),
    turningRadius: z.number().optional(),

    // Weight Details
    grossWeight: z.string().optional(),
    kerbWeight: z.string().optional(),
    frontAxleLoad: z.string().optional(),
    rearAxleLoad: z.string().optional(),

    // Performance
    maxSpeed: z.string().optional(),
    climbingAbility: z.string().optional(),
    fuelConsumption: z.string().optional(),

    // Chassis & Suspension
    chassisMaterial: z.string().optional(),
    frontSuspension: z.string().optional(),
    rearSuspension: z.string().optional(),
    suspensionType: z.string().optional(),

    // Braking System
    brakeSystem: z.string().optional(),
    frontBrake: z.string().optional(),
    rearBrake: z.string().optional(),
    parkingBrake: z.string().optional(),
    brakingSystem: z.string().optional(),

    // Steering & Tires
    steeringSystem: z.string().optional(),
    steeringType: z.string().optional(),
    tires: z.string().optional(),

    // Cabin
    cabinType: z.string().optional(),
    seats: z.number().optional(),
    cabinFeatures: z.array(z.string()).optional(),

    // Vehicle Types
    boxType: z.enum(['đông-lạnh', 'bảo-ôn', 'kín', 'bạt', 'lửng', 'bồn-xi-téc', 'cánh-dơi', 'ben', 'trộn-bê-tông', 'bơm-bê-tông', 'chở-gia-súc', 'chuyên-dùng', 'xe-tải-gắn-cẩu', 'máy-xúc-đào']).optional(),
    craneType: z.enum(['cẩu-rời', 'cẩu-gắn-xe']).optional(),
    trailerType: z.enum(['ben', 'sàn', 'sàn-rút', 'lùn', 'cổ-cò', 'xương', 'lửng', 'lồng', 'rào', 'xi-téc', 'bồn-xi-măng', 'bồn-sắt', 'bồn-bột-mì', 'đông-lạnh', 'hút-chất-thải', 'bồn-nh3', 'bồn-ni-tơ', 'bồn-hóa-chất', 'bồn-bột-pvc', 'bồn-nhựa-đường', 'bồn-thức-ăn', 'bồn-lpg', 'bồn-methanol', 'bồn-hạt-nhựa', 'bồn-co2', 'bồn-ethylene-glycol']).optional(),

    // Specialized Specs (stored as JSON strings for flexibility)
    coolingBox: z.record(z.any()).optional(),
    insulatedBox: z.record(z.any()).optional(),
    closedBox: z.record(z.any()).optional(),
    tarpaulinBox: z.record(z.any()).optional(),
    flatbedBox: z.record(z.any()).optional(),
    tankSpec: z.record(z.any()).optional(),
    craneSpec: z.record(z.any()).optional(),
    trailerSpec: z.record(z.any()).optional(),
    tractorSpec: z.record(z.any()).optional(),
    drillingSystem: z.record(z.any()).optional(),
    ladderSystem: z.record(z.any()).optional(),
    wireDispenserId: z.record(z.any()).optional(),
    aerialPlatformSpec: z.record(z.any()).optional(),
    vacuumSystem: z.record(z.any()).optional(),
    glassRackSpec: z.record(z.any()).optional(),
    manBasketSpec: z.record(z.any()).optional(),
    tiltDeckSpec: z.record(z.any()).optional(),
    streetSweeperSpec: z.record(z.any()).optional(),
    armRollSpec: z.record(z.any()).optional(),
    fireFightingSpec: z.record(z.any()).optional(),
    bitumenTankSpec: z.record(z.any()).optional(),
    excavatorSpec: z.record(z.any()).optional(),
    forkliftSpec: z.record(z.any()).optional(),
    bulldozerSpec: z.record(z.any()).optional(),
    graderSpec: z.record(z.any()).optional(),
    loaderSpec: z.record(z.any()).optional(),
    rollerSpec: z.record(z.any()).optional(),
    compactorSpec: z.record(z.any()).optional(),
    generatorSpec: z.record(z.any()).optional(),
    compressorSpec: z.record(z.any()).optional(),
    concreteMixerSpec: z.record(z.any()).optional(),
    batchingPlantSpec: z.record(z.any()).optional(),
    concretePumpSpec: z.record(z.any()).optional(),
    hoistSpec: z.record(z.any()).optional(),

    // Additional specs
    specifications: z.record(z.any()).optional(),

    // Order for sorting
    order: z.number().nullable().optional(),
  }),
});

// Blog Posts Collection Schema
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic Information
    id: z.string(),
    title: z.string(),
    slug: z.string().optional(),
    description: z.string(),

    // Category - dynamic, loaded from blog-categories collection
    category: z.string(),

    // Images
    images: z.array(z.string()),

    // Meta
    publishDate: z.number(),
    readTime: z.number(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
    views: z.number().optional(),
    comments: z.number().optional(),

    // Visibility
    isHidden: z.boolean().default(false),

    // Order for sorting
    order: z.number().nullable().optional(),
  }),
});

// Site Settings Collection Schema
const siteSettingsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    // General Section
    general_section: z.object({
      siteName: z.string(),
      siteTagline: z.string(),
      siteDescription: z.string(),
      siteKeywords: z.array(z.string()).optional(),
      siteUrl: z.string(),
      cdnUrl: z.string().optional(),
    }),

    // Images Section
    images_section: z.object({
      logo: z.string(),
      logoAlt: z.string(),
      favicon: z.string(),
      ogImage: z.string().optional(),
    }),

    // Contact Section
    contact_section: z.object({
      phone: z.string(),
      phoneDisplay: z.string(),
      email: z.string(),
      address: z.string().optional(),
    }),

    // Branches (Hệ thống chi nhánh)
    branches: z.array(z.object({
      regionName: z.string(),
      addresses: z.array(z.object({
        province: z.string(),
        address: z.string(),
        phone: z.string(),
        mapUrl: z.string().optional(),
      })),
    })),

    // Social Section
    social_section: z.object({
      facebookUrl: z.string().optional(),
      facebookUsername: z.string().optional(),
      messengerUrl: z.string().optional(),
      youtubeUrl: z.string().optional(),
      youtubeChannelName: z.string().optional(),
      tiktokUrl: z.string().optional(),
      tiktokUsername: z.string().optional(),
      zaloPhone: z.string().optional(),
    }),

    // SEO Section
    seo_section: z.object({
      googleVerification: z.string().optional(),
      bingVerification: z.string().optional(),
      themeColor: z.string(),
    }),

    // Organization Section (Schema.org) - Extended
    organization_section: z.object({
      organizationName: z.string(),
      alternateName: z.string().optional(),
      organizationType: z.enum(['AutoDealer', 'LocalBusiness', 'Corporation', 'Organization']),
      schemaPhone: z.string().optional(),
      priceRange: z.string().optional(),
      foundingDate: z.string().optional(),
      vatNumber: z.string().optional(),
      schemaDescription: z.string().optional(),
    }),

    // Schema Address (Địa chỉ trụ sở chính cho Schema)
    schema_address: z.object({
      streetAddress: z.string(),
      addressLocality: z.string(),
      addressRegion: z.string(),
      postalCode: z.string(),
      addressCountry: z.string(),
      latitude: z.number(),
      longitude: z.number(),
    }).optional(),

    // Schema Policies (Chính sách giao hàng & đổi trả)
    schema_policies: z.object({
      returnPolicy: z.enum(['MerchantReturnNotPermitted', 'MerchantReturnFiniteReturnWindow', 'MerchantReturnUnlimitedWindow']),
      returnDays: z.number(),
      shippingRate: z.number(),
      handlingTimeMin: z.number(),
      handlingTimeMax: z.number(),
      transitTimeMin: z.number(),
      transitTimeMax: z.number(),
    }).optional(),

    // Schema Reviews (Đánh giá mẫu)
    schema_reviews: z.array(z.object({
      authorName: z.string(),
      rating: z.number(),
      datePublished: z.string(),
      reviewBody: z.string(),
    })).optional(),

    // Colors Section (Bảng màu website)
    colors_section: z.object({
      primaryColor: z.string(),
      header: z.object({
        bgColor: z.string(),
        textColor: z.string(),
        hoverColor: z.string(),
      }),
      footer: z.object({
        bgColor: z.string(),
        textColor: z.string(),
        mutedColor: z.string(),
      }),
      pageHeader: z.object({
        bgColor: z.string(),
        textColor: z.string(),
      }),
      buttons: z.object({
        primaryBg: z.string(),
        primaryText: z.string(),
        secondaryBg: z.string(),
        secondaryText: z.string(),
      }),
      cards: z.object({
        bgColor: z.string(),
        borderColor: z.string(),
      }),
    }).optional(),
  }),
});

export const collections = {
  'categories': categoriesCollection,
  'blog-categories': blogCategoriesCollection,
  'banners': bannersCollection,
  'brands': brandsCollection,
  'products': productsCollection,
  'blog': blogCollection,
  'settings': siteSettingsCollection,
};
