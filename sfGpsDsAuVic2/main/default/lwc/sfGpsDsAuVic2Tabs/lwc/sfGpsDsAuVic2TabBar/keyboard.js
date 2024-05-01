function preventDefaultAndStopPropagation(event) {
  event.preventDefault();
  event.stopPropagation();
}

export function handleKeyDownOnTabList(
  event,
  currentFocusedIndex,
  tabsetInterface
) {
  const isArrowLeft = event.keyCode === 37;
  const isArrowRight = event.keyCode === 39;

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
