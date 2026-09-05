export interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  description: string;
  reference_clause: string;
}

export interface ChecklistResponse {
  product_name: string;
  applicable_standard: string;
  items: ChecklistItem[];
}
