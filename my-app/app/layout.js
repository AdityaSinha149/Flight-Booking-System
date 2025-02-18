import "./globals.css";
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

export const metadata = {
  title: "Tripma - Your Traver Buddy",
  description: "Tripma is the best travel platform for all your travel needs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
