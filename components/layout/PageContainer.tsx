"use client";

type PageContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <section
      className={[
        "mx-auto",
        "w-full",
        "max-w-7xl",
        "space-y-4",
        "pb-28",
        "lg:space-y-6",
        "lg:pb-0",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}