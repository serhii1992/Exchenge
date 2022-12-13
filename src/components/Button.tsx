import cn from "classnames";
import React, { Children, FC, ReactNode } from "react";

type DefaultButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

interface IButtonProps extends Omit<DefaultButtonProps, "ref" | "onClick"> {
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  children: ReactNode;
}

export const Button: FC<IButtonProps> = React.forwardRef<HTMLButtonElement, IButtonProps>(
  ({ children, onClick, className, disabled, ...props }, ref) => {
    return (
      <>
        <button
          className={cn(
            "h-8 w-full rounded-2xl bg-violet-50 px-4  duration-300 font-semibold",
            disabled ? "text-neutral-400" : "hover:outline hover:outline-1 hover:outline-blue-500 ",
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
