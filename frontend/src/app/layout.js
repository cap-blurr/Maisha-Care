import './globals.css'
import { Inter } from 'next/font/google'
import { headers } from 'next/headers'
import { cookieToInitialState } from 'wagmi'
import { config } from './walletConnectConfig'
import WalletConnectProvider from './WalletConnectProvider'
import ErrorBoundary from './components/ErrorBoundary'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const initialState = cookieToInitialState(config, headers().get('cookie'))
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletConnectProvider initialState={initialState}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </WalletConnectProvider>
      </body>
    </html>
  )
}