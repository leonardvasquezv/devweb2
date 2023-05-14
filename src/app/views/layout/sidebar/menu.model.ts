
export interface MenuItem {
  id?: number;
  label?: string;
  icon?: string;
  link?: string;
  expanded?: boolean;
  subItems?: Array<MenuItem>;
  isTitle?: boolean;
  badge?: any;
  parentId?: number;
}
