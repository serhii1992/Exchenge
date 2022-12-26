import cn from "classnames";
import React, { Children, FC, ReactNode } from "react";

type DefaultButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface IButtonProps extends Omit<DefaultButtonProps, "ref" | "onClick"> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: ReactNode;
  appearance?: "primary" | "secondary";
}

export const Button: FC<IButtonProps> = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, appearance =  "primary", onClick, className, disabled, ...props }, ref) => {

    return (
      <>
        <button
          className={cn(
            "w-full rounded-2xl  px-4  duration-300 font-semibold",
            appearance === "primary" && "bg-pink-500 ",
            appearance === "secondary" && "bg-slate-200 hover:bg-slate-300",
            disabled && "text-neutral-400 bg-opacity-30",
            className
          )}
          onClick={onClick}
          ref={ref}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      </>
    );
  }
);
