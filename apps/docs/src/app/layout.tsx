import Content from "@/components/content";
import Nav from "@/components/nav";

import "@/lib/style/css/globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        {/* nav, header, footer, etc */}
        <Nav />

        <Content>{children}</Content>
      </body>
    </html>
  );
}
