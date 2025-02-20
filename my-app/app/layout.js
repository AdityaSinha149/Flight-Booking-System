import "./globals.css";
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { SearchProvider } from './SearchContext';
import { FlightProvider } from "./FlightContext";

export const metadata = {
  title: "Tripma - Your Traver Buddy",
  description: "Tripma is the best travel platform for all your travel needs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FlightProvider>
          <SearchProvider>
            <ThemeProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ThemeProvider>
          </SearchProvider>
        </FlightProvider>
      </body>
    </html>
  );
}
