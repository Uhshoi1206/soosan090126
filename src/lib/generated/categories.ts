/**
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from src/content/categories/*.json and src/content/settings/box-types.json
 * Run: npm run cms:sync
 */

export interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string[];
  isHidden: boolean;
  order: number;
}

export interface BoxTypeData {
  id: string;
  name: string;
  order: number;
}

export interface TrailerTypeData {
  id: string;
  name: string;
  order: number;
}

// ============================================
// CATEGORIES (Loại xe: xe-tai, can-cau, mooc, dau-keo, may-moc-thiet-bi)
// ============================================
export const categories: CategoryData[] = [
  {
    "id": "xe-tai",
    "name": "Xe Tải",
    "slug": "xe-tai",
    "description": "Các dòng xe tải từ nhẹ đến nặng phục vụ vận chuyển hàng hóa",
    "keywords": [
      "xe tải",
      "truck",
      "tải trọng",
      "thùng",
      "vận chuyển",
      "hàng hóa"
    ],
    "isHidden": false,
    "order": 1
  },
  {
    "id": "can-cau",
    "name": "Cần Cẩu",
    "slug": "can-cau",
    "description": "Cần cẩu chuyên dụng cho công trình xây dựng và vận chuyển hàng nặng",
    "keywords": [
      "cẩu",
      "crane",
      "nâng",
      "cần cẩu",
      "xe cẩu",
      "tải cẩu",
      "xe tải gắn cẩu",
      "tải gắn cẩu",
      "nâng hạ",
      "lifting"
    ],
    "isHidden": false,
    "order": 2
  },
  {
    "id": "mooc",
    "name": "Sơ Mi Rơ Mooc",
    "slug": "mooc",
    "description": "Các loại sơ mi rơ mooc phục vụ vận tải đường dài",
    "keywords": [
      "mooc",
      "sơ mi rơ mooc",
      "rơ mooc",
      "semi-trailer",
      "trailer",
      "container"
    ],
    "isHidden": false,
    "order": 3
  },
  {
    "id": "dau-keo",
    "name": "Xe Đầu Kéo",
    "slug": "dau-keo",
    "description": "Xe đầu kéo mạnh mẽ cho vận tải container và hàng nặng",
    "keywords": [
      "đầu kéo",
      "tractor",
      "kéo",
      "xe đầu kéo"
    ],
    "isHidden": false,
    "order": 4
  },
  {
    "id": "may-moc-thiet-bi",
    "name": "Máy Móc & Thiết Bị",
    "slug": "may-moc-thiet-bi",
    "description": "Máy móc và thiết bị công nghiệp: máy khoan cọc nhồi, máy đóng cọc, máy ép cọc, xe nâng, xe lu, và các loại thiết bị chuyên dụng cho xây dựng, kho vận, sản xuất công nghiệp",
    "keywords": [
      "máy móc thiết bị",
      "thiết bị công nghiệp",
      "máy công trình",
      "máy khoan cọc nhồi",
      "máy đóng cọc",
      "máy ép cọc",
      "xe nâng",
      "xe lu",
      "thiết bị xây dựng",
      "construction equipment",
      "industrial equipment",
      "forklift",
      "road roller",
      "piling machine",
      "foundation equipment"
    ],
    "isHidden": false,
    "order": 5
  }
];

// ============================================
// BOX TYPES (Loại thùng xe tải)
// ============================================
export const boxTypes: BoxTypeData[] = [
  {
    "id": "đông-lạnh",
    "name": "Thùng Đông Lạnh",
    "order": 1
  },
  {
    "id": "bảo-ôn",
    "name": "Thùng Bảo Ôn",
    "order": 2
  },
  {
    "id": "kín",
    "name": "Thùng Kín",
    "order": 3
  },
  {
    "id": "bạt",
    "name": "Thùng Bạt",
    "order": 4
  },
  {
    "id": "lửng",
    "name": "Thùng Lửng",
    "order": 5
  },
  {
    "id": "bồn-xi-téc",
    "name": "Xe Bồn Xi Téc",
    "order": 6
  },
  {
    "id": "cánh-dơi",
    "name": "Thùng Cánh Dơi",
    "order": 7
  },
  {
    "id": "ben",
    "name": "Xe Ben (Xe Tự Đổ)",
    "order": 8
  },
  {
    "id": "trộn-bê-tông",
    "name": "Xe Trộn Bê Tông",
    "order": 9
  },
  {
    "id": "bơm-bê-tông",
    "name": "Xe Bơm Bê Tông",
    "order": 10
  },
  {
    "id": "chở-gia-súc",
    "name": "Thùng Chở Gia Súc",
    "order": 11
  },
  {
    "id": "chuyên-dùng",
    "name": "Xe Chuyên Dùng",
    "order": 12
  },
  {
    "id": "xe-tải-gắn-cẩu",
    "name": "Xe Tải Gắn Cẩu",
    "order": 13
  },
  {
    "id": "máy-xúc-đào",
    "name": "Máy Xúc Đào",
    "order": 14
  }
];

// ============================================
// TRAILER TYPES (Loại mooc)
// ============================================
export const trailerTypes: TrailerTypeData[] = [
  {
    "id": "ben",
    "name": "Mooc Ben",
    "order": 1
  },
  {
    "id": "sàn",
    "name": "Mooc Sàn",
    "order": 2
  },
  {
    "id": "sàn-rút",
    "name": "Mooc Sàn Rút Dài",
    "order": 3
  },
  {
    "id": "lùn",
    "name": "Mooc Lùn",
    "order": 4
  },
  {
    "id": "cổ-cò",
    "name": "Mooc Cổ Cò",
    "order": 5
  },
  {
    "id": "xương",
    "name": "Mooc Xương",
    "order": 6
  },
  {
    "id": "lửng",
    "name": "Mooc Lửng",
    "order": 7
  },
  {
    "id": "lồng",
    "name": "Mooc Lồng",
    "order": 8
  },
  {
    "id": "rào",
    "name": "Mooc Rào",
    "order": 9
  },
  {
    "id": "xi-téc",
    "name": "Mooc Xi Téc",
    "order": 10
  },
  {
    "id": "bồn-xi-măng",
    "name": "Mooc Bồn Chở Xi Măng Rời",
    "order": 11
  },
  {
    "id": "bồn-sắt",
    "name": "Mooc Bồn Chở Bụi Sắt",
    "order": 12
  },
  {
    "id": "bồn-bột-mì",
    "name": "Mooc Bồn Chở Bột Mì",
    "order": 13
  },
  {
    "id": "đông-lạnh",
    "name": "Mooc Đông Lạnh",
    "order": 14
  },
  {
    "id": "hút-chất-thải",
    "name": "Mooc Hút Chất Thải",
    "order": 15
  },
  {
    "id": "bồn-nh3",
    "name": "Mooc Bồn Chở NH3 Lỏng",
    "order": 16
  },
  {
    "id": "bồn-ni-tơ",
    "name": "Mooc Bồn Chở Ni Tơ Lỏng",
    "order": 17
  },
  {
    "id": "bồn-hóa-chất",
    "name": "Mooc Bồn Chở Hóa Chất",
    "order": 18
  },
  {
    "id": "bồn-bột-pvc",
    "name": "Mooc Bồn Chở Bột Nhựa PVC",
    "order": 19
  },
  {
    "id": "bồn-nhựa-đường",
    "name": "Mooc Bồn Chở Nhựa Đường",
    "order": 20
  },
  {
    "id": "bồn-thức-ăn",
    "name": "Mooc Bồn Chở Thức Ăn Chăn Nuôi",
    "order": 21
  }
];

// ============================================
// CATEGORY HELPER FUNCTIONS
// ============================================
export function getAllCategories(): CategoryData[] {
  return categories;
}

export function getVisibleCategories(): CategoryData[] {
  return categories.filter(c => !c.isHidden);
}

export function getCategoryById(id: string): CategoryData | undefined {
  return categories.find(c => c.id === id);
}

export function getCategoryName(id: string): string {
  return getCategoryById(id)?.name || id;
}

export function getEnabledTypes(): string[] {
  return getVisibleCategories().map(c => c.id);
}

export function getTypeKeywords(type: string): string[] {
  const cat = getCategoryById(type);
  return cat?.keywords || [];
}

export function filterVisibleTrucks<T extends { type: string; isHidden?: boolean }>(trucks: T[]): T[] {
  const visibleTypes = new Set(getEnabledTypes());
  return trucks.filter(t => visibleTypes.has(t.type) && !t.isHidden);
}

// ============================================
// BOX TYPE HELPER FUNCTIONS
// ============================================
export function getAllBoxTypes(): BoxTypeData[] {
  return boxTypes;
}

export function getBoxTypeById(id: string): BoxTypeData | undefined {
  return boxTypes.find(b => b.id === id);
}

export function getBoxTypeName(id?: string): string {
  if (!id) return '';
  return getBoxTypeById(id)?.name || '';
}

// ============================================
// TRAILER TYPE HELPER FUNCTIONS
// ============================================
export function getAllTrailerTypes(): TrailerTypeData[] {
  return trailerTypes;
}

export function getTrailerTypeById(id: string): TrailerTypeData | undefined {
  return trailerTypes.find(t => t.id === id);
}

export function getTrailerTypeName(id?: string): string {
  if (!id) return '';
  return getTrailerTypeById(id)?.name || '';
}
