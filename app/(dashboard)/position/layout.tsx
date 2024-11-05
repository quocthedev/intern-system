import React from "react";

export type PositionMananagementLayoutProps = {
  children: React.ReactNode;
};

export default function PositionMananagementLayout(
  props: PositionMananagementLayoutProps,
) {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-6">
      <h1 className="text-left text-2xl font-semibold capitalize text-black">
        Position management
      </h1>

      {props.children}
    </div>
  );
}
