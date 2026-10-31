import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreakingTicker } from "@/components/news/BreakingTicker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <BreakingTicker />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
