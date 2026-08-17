import BottomNav from "@/components/BottomNav";

export default function TabsLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}
