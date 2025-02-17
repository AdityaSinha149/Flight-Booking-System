import "./globals.css";

export const metadata = {
  title: "Tripma - Your Traver Buddy",
  description: "Tripma is the best travel platform for all your travel needs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
