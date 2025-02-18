import "./globals.css";
import { AuthProvider } from './AuthContext';

export const metadata = {
  title: "Tripma - Your Traver Buddy",
  description: "Tripma is the best travel platform for all your travel needs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
