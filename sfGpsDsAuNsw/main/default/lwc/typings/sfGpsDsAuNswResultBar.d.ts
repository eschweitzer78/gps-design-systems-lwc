
declare module "c/sfGpsDsAuNswResultBar" { 
  import type SfGpsDsElement from "c/sfGpsDsElement"; 
  import type { PropertyAccessor } from "c/sfGpsDsElement";

  export interface SortOption {
    value: string,
    label: string,
    selected?: boolean
  }

  export default 
  class SfGpsDsAuNswResultBar 
  extends SfGpsDsElement {
    name: string;
    className: string;

    from: number;
    to: number;
    total: number;

    noResultText: string;
    resultsText: string;

    value: string;

    sortOptions: SortOption[] | SortOption;

    // private
    _from: PropertyAccessor<number>;
    _to: PropertyAccessor<number>;
    _total: PropertyAccessor<number>;
    _value: PropertyAccessor<string>;

    _sortOptions: SortOption[];
    _sortOptionsOriginal: SortOption[] | SortOption;
    _visibleSortOptions: SortOption[];

    readonly computedClassName: any;

    _selectId: string;
    readonly computedSelectId: string;

    readonly computedResultsText: string;

    reconcileValueOptions(): void;
    handleSelectChange(event: InputEvent): void;
  }
}
