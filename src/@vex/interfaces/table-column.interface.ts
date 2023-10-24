export interface TableColumn<T> {
  label: string;
  subLabel?:string;
  property: keyof T | string;
  alternative?:keyof T | string;
  footerProperty?:keyof T | string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button';
  visible?: boolean;
  cssClasses?: string[];
}
