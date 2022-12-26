import React, { FC, InputHTMLAttributes, ReactNode, useState } from "react";
import cn from "classnames";

type DefaultInputProps = React.DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

interface IIProps extends Omit<DefaultInputProps, "ref" | "value" | "onChange"> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  value?: string;
  errorMessage?: string;
  inputType?: "primary" | "secondary";
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, IIProps>(
  (
    {
      className,
      value,
      errorMessage,
      onChange,
      endAdornment,
      startAdornment,
      inputType = "primary",
      ...props
    },
    ref
  ) => {

    const backgroundColors = {
      primary: "bg-transparent",
      secondary: "bg-violet-50"
    };

    const border = {
      primary: "border-none",
      secondary: "border border-slate-300 rounded-md"
    };

    const baseClasses = [
      "flex items-center  w-full ",
      !!errorMessage && "border border-red-600",
      backgroundColors[inputType],
      border[inputType],
    ];

    return (
      <div>
        <div className={cn(baseClasses, className)}>
          {startAdornment}
          <input
            className={"w-full text-inherit  bg-inherit leading-none outline-none px-4 border-none"}
            value={value}
            ref={ref}
            onChange={onChange ? (event) => onChange(event, event.target.value) : undefined}
            {...props}
          />
          {endAdornment}
        </div>

        {!!errorMessage && <div className={"text-red-500 text-sm"}>{errorMessage}</div>}
      </div>
    );
  }
);
