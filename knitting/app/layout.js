import { Merriweather_Sans } from "next/font/google"
import "./globals.css";
import Navbar from "./ui/navbar/navbar";
import Footer from "./ui/footer/footer";
import Chatbot from './ui/chatbot';
import ClarityProvider from './clarity-provider';
import { getCurrentUser } from '../lib/auth';

const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather-sans",
});

export const metadata = {
  title: "Knitting Buddy",
  description: "blabla",
};

export default async function RootLayout({ children }) {
  const user = await getCurrentUser();
  return (
    <html lang="en" data-theme="mytheme" >
      <body className={`${merriweatherSans.variable} font-sans`}>
        <ClarityProvider />
        <div>
          <Navbar/>
        </div>
        {children}
        <Chatbot user={user}/>
        <Footer/>
      </body>
    </html>
  );
}