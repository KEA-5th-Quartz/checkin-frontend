interface SecondCategory {
  secondCategoryId: number;
  name: string;
}

interface Category {
  firstCategoryId: number;
  firstCategoryName: string;
  secondCategories: SecondCategory[];
}

export interface CategoryResponse {
  data: {
    data: Category[];
  };
}

export interface templateList {
  title: string;
  firstCategory: string;
  secondCategory: string;
  content: string;
}
