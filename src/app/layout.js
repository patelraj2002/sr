// src/app/layout.js
import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'SR Homes',
  description: 'Find your perfect home',
  icons: {
    icon: '/app/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Script
          id="google-maps"
          strategy="afterInteractive"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        />
      </head>
      <body suppressHydrationWarning={true} className="min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}