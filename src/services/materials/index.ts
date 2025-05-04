
import { fetchMaterials, getAllMaterialsWithRatings, getMyMaterials, getSavedMaterials, getMaterialById } from './api';
import { uploadMaterial, deleteMaterial, incrementDownload } from './utils';
import { 
  rateMaterial, isMaterialSaved, getUserRating, getMaterialRating, 
  saveMaterial, unsaveMaterial 
} from './interactions';

// Export the combined service
export const materialsService = {
  fetchMaterials,
  getMaterialById,
  uploadMaterial,
  rateMaterial,
  saveMaterial,
  unsaveMaterial,
  isMaterialSaved,
  getUserRating,
  getMaterialRating,
  incrementDownload,
  deleteMaterial,
  getAllMaterialsWithRatings,
  getMyMaterials,
  getSavedMaterials
};

// Export types with proper export type syntax
export type { Material, MaterialRating, MaterialsFilterOptions, MaterialFilter } from './types';
