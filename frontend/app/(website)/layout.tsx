import Header from "@/components/BlogComponent/menuheader";
import Footer from "@/components/BlogComponent/footer";
import Container from "@/components/BlogComponent/container";
//giao diện tran chủ website
export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col">
      <main className="flex-1">
        <Container>
          <Header />
          {children}
        </Container>
      </main>

      <Footer />
    </div>
  );
}