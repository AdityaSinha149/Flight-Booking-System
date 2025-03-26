import "./globals.css";
import { AuthProvider } from "@/Contexts/AuthContext";
import { ThemeProvider } from "@/Contexts/ThemeContext";
import { SearchProvider } from "@/Contexts/SearchContext";
import { FlightProvider } from "@/Contexts/FlightContext";
import { PassengerProvider } from "@/Contexts/passengerContext";

export const metadata = {
  title: "Tripma - Your Traver Buddy",
  description: "Tripma is the best travel platform for all your travel needs.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <PassengerProvider>
          <FlightProvider>
            <SearchProvider>
              <ThemeProvider>
                <AuthProvider>
                  {children}
                </AuthProvider>
              </ThemeProvider>
            </SearchProvider>
          </FlightProvider>
        </PassengerProvider>
      </body>
    </html>
  );
}
