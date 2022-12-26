import React, { ReactNode, useLayoutEffect, useRef, useState } from "react";

interface IDropdownProps {
  target: ReactNode;
  classNames?: string;
  children?: ReactNode;
}

export const Dropdown: React.FC<IDropdownProps> = ({ classNames, children, target }) => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const targetNode = useRef<HTMLHeadingElement>(null);
  const targetNodeRect: DOMRect | undefined = targetNode?.current?.getBoundingClientRect();

  const toggleOpenDropdown = () => {
    setIsOpenDropdown(!isOpenDropdown);
  };

  const closeDropdown = () => {
    setIsOpenDropdown(false);
  };

  return (
    <div>
      <div className="" ref={targetNode} onClick={toggleOpenDropdown}>
        {target}
      </div>
      {isOpenDropdown && (
        <div className={"fixed top-0 right-0 bottom-0 left-0 z-50"} onClick={closeDropdown}>
          <div
            className="absolute "
            style={{
              left: targetNodeRect?.right,
              top: (targetNodeRect?.bottom || 0) + 8,
              transform: "translateX(-100%)",
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
