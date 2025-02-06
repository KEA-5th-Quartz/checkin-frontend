// types/category.ts
export interface SecondCategory {
  secondCategoryId: number;
  name: string;
}

export interface FirstCategory {
  firstCategoryId: number;
  firstCategoryName: string;
  alias: string | null;
  contentGuide: string | null;
  secondCategories: SecondCategory[];
}

export interface CategoryResponse {
  status: number;
  data: FirstCategory[];
}
