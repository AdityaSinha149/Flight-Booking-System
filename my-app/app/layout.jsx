import './globals.css'
import { Inter } from 'next/font/google'
import { FlightProvider } from '@/contexts/FlightContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { PassengerProvider } from '@/contexts/PassengerContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { SearchProvider } from '@/contexts/SearchContext'
import { SeatProvider } from '@/contexts/SeatContext'
import { AdminProvider } from "@/contexts/AdminContext";
import { SuperAdminProvider } from '@/contexts/SuperAdminContext';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Flight Booking System',
    description: 'Book your flights easily and quickly',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Newsreader:opsz,wght@6..72,600&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={inter.className}>
                <AdminProvider>
                    <SeatProvider>
                        <PassengerProvider>
                            <AuthProvider>
                                <SearchProvider>
                                    <ThemeProvider>
                                        <FlightProvider>
                                            <SuperAdminProvider>
                                                {children}
                                            </SuperAdminProvider>
                                        </FlightProvider>
                                    </ThemeProvider>
                                </SearchProvider>
                            </AuthProvider>
                        </PassengerProvider>
                    </SeatProvider>
                </AdminProvider>
            </body>
        </html>
    )
}