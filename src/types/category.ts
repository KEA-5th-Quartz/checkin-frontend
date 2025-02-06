// types/category.ts
export interface SecondCategory {
  secondCategoryId: number;
  firstCategoryId: number;
  name: string;
  alias: string | null;
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
