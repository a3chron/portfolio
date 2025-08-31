import { PropsWithChildren } from "react";

export const Card: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="group overflow-hidden relative duration-500 rounded-2xl bg-bg md:gap-8 text-text">
      {children}
    </div>
  );
};
