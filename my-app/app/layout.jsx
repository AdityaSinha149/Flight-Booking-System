import './globals.css'
import { Inter } from 'next/font/google'
import { FlightProvider } from '@/Contexts/FlightContext'
import { ThemeProvider } from '@/Contexts/ThemeContext'
import { PassengerProvider } from '@/Contexts/PassengerContext'
import { AuthProvider } from '@/Contexts/AuthContext'
import { SearchProvider } from '@/Contexts/SearchContext'
import { SeatProvider } from '@/Contexts/SeatContext'
import { AdminProvider } from '@/Contexts/AdminContext'
import { SuperAdminProvider } from '@/Contexts/SuperAdminContext'

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