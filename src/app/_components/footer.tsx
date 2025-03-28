import Container from "@/app/_components/container";
import Link from "next/link";
import { CMS_NAME } from "@/lib/constants";
import { Logo } from "./logo";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12 mt-12">
      <Container>
        <div className="flex flex-col md:grid md:grid-cols-8 gap-12 md:gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-5 lg:pr-8">
            <div className="flex flex-col items-center md:items-start">
              <Logo className="mb-6 transform scale-90" />
              <p className="text-gray-400 mb-6 text-base leading-relaxed text-center md:text-left max-w-sm">
                Your trusted source for blockchain news, insights, and expert interviews.
                Stay informed about the latest developments in Bitcoin, Ethereum, Solana, and more.
              </p>
              <p className="text-gray-500 text-sm text-center md:text-left">
                © {currentYear} {CMS_NAME}. All rights reserved.
              </p>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="md:col-span-3 flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-6 text-gray-200">Quick Links</h3>
            <ul className="flex flex-col items-center md:items-start space-y-4">
              <li>
                <Link href="/posts" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 text-base">
                  All Posts
                </Link>
              </li>
              <li>
                <Link href="/press-releases" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 text-base">
                  Press Releases
                </Link>
              </li>
              <li>
                <Link href="/amas" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 text-base">
                  AMAs
                </Link>
              </li>
              <li>
                <Link href="/posts?topics=bitcoin" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 text-base">
                  Bitcoin
                </Link>
              </li>
              <li>
                <Link href="/posts?topics=ethereum" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 text-base">
                  Ethereum
                </Link>
              </li>
              <li>
                <Link href="/posts?topics=solana" className="text-gray-400 hover:text-white transition-colors duration-200 inline-block hover:translate-x-1 text-base">
                  Solana
                </Link>
              </li>
            </ul>
          </div>
          

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto">
          <p className="text-gray-500 text-sm mb-8 sm:mb-0 text-center sm:text-left">
            Built with ❤️ by Jay
          </p>
          <div className="flex items-center space-x-6 sm:space-x-8">
            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors transform hover:scale-110">
              <span className="sr-only">GitHub</span>
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
