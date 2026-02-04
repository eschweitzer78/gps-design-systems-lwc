const ARROW_UP_KEY = "ArrowUp";
const UP_KEY = "Up";
const ARROW_DOWN_KEY = "ArrowDown";
const DOWN_KEY = "Down";

/**
 * Performs the scrolling for a listbox such that the user will always be able to view the listbox item for up
 * and down keyboard controls
 * @param {*} listboxNode
 * @param {*} nextItem
 * @param {String} selectedKey
 * @returns {void}
 */
export function listboxScrollUpDown(listboxNode, nextItem, selectedKey) {
  if (
    listboxNode &&
    nextItem &&
    listboxNode.scrollHeight > listboxNode.clientHeight
  ) {
    const scrollBottomValue = listboxNode.clientHeight + listboxNode.scrollTop;
    const itemBottomValue = nextItem.offsetTop + nextItem.offsetHeight;

    switch (selectedKey) {
      case ARROW_UP_KEY: // Flows down to UP_KEY
      case UP_KEY: {
        // Indicates item is at the top, user will be scrolled to the bottom
        if (itemBottomValue === 0) {
          listboxNode.scrollTop = listboxNode.scrollHeight;
        }
        // Indicates user is within the listbox and will scroll accordingly
        else if (itemBottomValue < scrollBottomValue) {
          listboxNode.scrollTop = itemBottomValue - listboxNode.clientHeight;
        } else if (nextItem.offsetTop > listboxNode.scrollTop) {
          listboxNode.scrollTop = nextItem.offsetTop;
        }
        break;
      }
      case ARROW_DOWN_KEY: // Flows down to DOWN_KEY
      case DOWN_KEY: {
        // Indicates user is within the listbox and will scroll accordingly
        if (itemBottomValue > scrollBottomValue) {
          listboxNode.scrollTop = itemBottomValue - listboxNode.clientHeight;
        }
        // Indicates user is at the bottom, user will be scrolled to the top
        else if (
          itemBottomValue !== 0 &&
          nextItem.offsetTop < listboxNode.scrollTop
        ) {
          listboxNode.scrollTop = 0;
        }
        break;
      }
      default: // Do nothing
    }
  }
}
