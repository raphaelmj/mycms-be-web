export interface ContextMenuElement {
  id: number;
  type: 'page' | 'variant' | 'department';
  path: string;
  name: string;
  defaultName?: string;
}
