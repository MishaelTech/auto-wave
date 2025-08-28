import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <Header />
            {children}
            <Footer />
        </main>
    );
}