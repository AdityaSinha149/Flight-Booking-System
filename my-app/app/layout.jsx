import './globals.css'
import { Inter } from 'next/font/google'
import { FlightProvider } from '@/Contexts/FlightContext'
import { ThemeProvider } from '@/Contexts/ThemeContext'
import { PassengerProvider } from '@/Contexts/PassengerContext'
import { AuthProvider } from '@/Contexts/AuthContext'
import { SearchProvider } from '@/Contexts/SearchContext'
import { SeatProvider } from '@/Contexts/SeatContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Flight Booking System',
    description: 'Book your flights easily and quickly',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <SeatProvider>
                    <PassengerProvider>
                        <AuthProvider>
                            <SearchProvider>
                                <ThemeProvider>
                                    <FlightProvider>
                                        {children}
                                    </FlightProvider>
                                </ThemeProvider>
                            </SearchProvider>
                        </AuthProvider>
                    </PassengerProvider>
                </SeatProvider>
            </body>
        </html>
    )
}