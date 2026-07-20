import Nav from "@/components/nav";
import Prose from "@/components/prose";

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

        <Prose>{children}</Prose>
      </body>
    </html>
  );
}
