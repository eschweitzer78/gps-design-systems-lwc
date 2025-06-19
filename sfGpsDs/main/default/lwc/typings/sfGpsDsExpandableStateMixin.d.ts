declare module "c/sfGpsDsExpandableStateMixin" {

  type Constructor = new (...args: any[]) => {};
  export default function ExpandableState<B extends Constructor>(
    base: B, 
    idAttr = "id", 
    activeAttr = "active", 
    indexAttr = "index"
  );
}