#!/usr/bin/env node
/**
 * Generate static categories data for client-side use
 * Reads from src/content/categories/*.json and src/content/settings/box-types.json
 * Writes to src/lib/generated/categories.ts
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const CATEGORIES_DIR = 'src/content/categories';
const BOX_TYPES_FILE = 'src/data/box-types.json';
const OUTPUT_FILE = 'src/lib/generated/categories.ts';

async function generateCategoriesData() {
  console.log('🔍 Loading categories from', CATEGORIES_DIR);

  // Load categories
  const files = await readdir(CATEGORIES_DIR);
  const jsonFiles = files.filter(f => f.endsWith('.json'));

  const categories = [];
  for (const file of jsonFiles) {
    const content = await readFile(join(CATEGORIES_DIR, file), 'utf-8');
    const data = JSON.parse(content);

    categories.push({
      id: data.id,
      name: data.name,
      slug: data.slug || data.id,
      description: data.description || '',
      keywords: data.keywords || [data.name.toLowerCase()],
      isHidden: data.isHidden || false,
      order: data.order || 999,
    });
  }

  categories.sort((a, b) => a.order - b.order);
  console.log(`✅ Found ${categories.length} categories`);

  // Load box types and trailer types
  let boxTypes = [];
  let trailerTypes = [];

  if (existsSync(BOX_TYPES_FILE)) {
    console.log('🔍 Loading box types from', BOX_TYPES_FILE);
    const boxTypesContent = await readFile(BOX_TYPES_FILE, 'utf-8');
    const boxTypesData = JSON.parse(boxTypesContent);
    boxTypes = boxTypesData.boxTypes || [];
    trailerTypes = boxTypesData.trailerTypes || [];
    boxTypes.sort((a, b) => (a.order || 999) - (b.order || 999));
    trailerTypes.sort((a, b) => (a.order || 999) - (b.order || 999));
    console.log(`✅ Found ${boxTypes.length} box types and ${trailerTypes.length} trailer types`);
  } else {
    console.log('⚠️ Box types file not found, skipping...');
  }

  // Generate TypeScript file
  const tsContent = `/**
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
export const categories: CategoryData[] = ${JSON.stringify(categories, null, 2)};

// ============================================
// BOX TYPES (Loại thùng xe tải)
// ============================================
export const boxTypes: BoxTypeData[] = ${JSON.stringify(boxTypes, null, 2)};

// ============================================
// TRAILER TYPES (Loại mooc)
// ============================================
export const trailerTypes: TrailerTypeData[] = ${JSON.stringify(trailerTypes, null, 2)};

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
`;

  // Create directory if not exists
  await mkdir('src/lib/generated', { recursive: true });

  // Write file
  await writeFile(OUTPUT_FILE, tsContent, 'utf-8');

  console.log('✅ Generated', OUTPUT_FILE);
  console.log('\\n📦 Categories, box types, and trailer types are now available for client-side use');
}

generateCategoriesData().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
