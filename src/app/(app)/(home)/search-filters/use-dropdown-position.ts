import { RefObject } from "react";

export const useDropdownPosition = (
  ref: RefObject<HTMLDivElement | null> | RefObject<HTMLDivElement>
) => {
  const getDropdownPosition = () => {
    if (!ref.current) return { top: 0, left: 0 };

    const rect = ref.current.getBoundingClientRect();
    const dropdownWidth = 240;

    //calculate the initial position
    let left = rect.left + window.scrollX;
    const top = rect.bottom + window.scrollY;

    //check if dropdown overflows the viewport
    if (left + dropdownWidth > window.innerWidth) {
      left = rect.right + window.scrollX - dropdownWidth;

      //if still off-screen align to right of the viewport with some padding
      if (left < 0) {
        left = window.innerWidth - dropdownWidth - 16; // 16px padding
      }
    }

    // ensure dropdown doesnt go off left edge
    if (left < 0) {
      left =  16; // 16px padding
    }

    return { top, left };
  };
  return {
    getDropdownPosition,
  };
};
