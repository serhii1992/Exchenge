import cn from "classnames";
import React, { FC, ReactNode } from "react";

interface IModalProps {
  active: boolean;
  handleClickModal?: () => void;
  children: ReactNode;
}

export const Modal: FC<IModalProps> = ({ active, handleClickModal, children }) => {

  return (
    <div
      className={cn(
        `w-full h-screen bg-slate-800 bg-opacity-40 fixed top-0 right-0 bottom-0 flex left-0 items-center justify-center  duration-500 ${
          active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none "
        }`
      )}
      onClick={handleClickModal}
    >
      <div
        className={cn(`rounded-xl bg-white duration-300 max-w-md  w-full overflow-hidden ${active ? "opacity-100 scale-100" : " scale-50"}`)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};
