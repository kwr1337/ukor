import type { Metadata } from 'next'
import { Zen_Kaku_Gothic_New } from 'next/font/google'
import { Toaster } from 'sonner'

import './globals.scss'
import { ThemeProvider } from '@/context/ThemeContext'
import { Providers } from './providers'

const zen = Zen_Kaku_Gothic_New({
	subsets: ['latin'],
	weight: ['400', '500', '700', '900'],
	variable: '--font-zen'
})

export const metadata: Metadata = {
	title: 'Система управления складом',
	description: 'Система управления складом и заказами'
}

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="ru">
			<body className={zen.className}>
				<Providers>
					<ThemeProvider>
						{children}

						<Toaster
							theme='dark'
							position='bottom-right'
							duration={1500}
						/>
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	)
}
