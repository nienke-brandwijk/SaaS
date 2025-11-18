import { Merriweather_Sans } from "next/font/google"
import "./globals.css";
import Navbar from "./ui/navbar/navbar";
import Footer from "./ui/footer/footer";
import Chatbot from './ui/chatbot';

const merriweatherSans = Merriweather_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-merriweather-sans",
});

export const metadata = {
  title: "Knitting Buddy",
  description: "blabla",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="mytheme" >
      <body className={`${merriweatherSans.variable} font-sans`}>
        <div>
          <Navbar/>
        </div>
        {children}
        <Chatbot/>
        <Footer/>
      </body>
    </html>
  );
}