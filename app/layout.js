import './globals.css'
import Footer from '../components/Footer'

export const metadata = {
  title: 'Quiz3',
  description: 'Gamified learning app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-white flex flex col min-h-screen">
        <main className="flex-grow">
        {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
