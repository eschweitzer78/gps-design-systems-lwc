function preventDefaultAndStopPropagation(
  event: Event
): void {
  event.preventDefault();
  event.stopPropagation();
}

export function handleKeyDownOnTabList(
  event: KeyboardEvent,
  currentFocusedIndex: number,
  tabsetInterface: {
    totalTabs: () => number,
    selectTabIndex: (index: number) => void
  }
): void {
  const isArrowLeft = event.key === "ArrowLeft";
  const isArrowRight = event.key === "ArrowRight";

  if (isArrowLeft || isArrowRight) {
    preventDefaultAndStopPropagation(event);

    const increment = isArrowLeft ? -1 : 1;
    let newIndex = currentFocusedIndex + increment;
    if (newIndex < 0) {
      newIndex = tabsetInterface.totalTabs() - 1;
    }

    if (newIndex + 1 > tabsetInterface.totalTabs()) {
      newIndex = 0;
    }

    tabsetInterface.selectTabIndex(newIndex);
  }
}
