import { User } from '../src/domain/user';
import Image from 'next/image';
import Link from 'next/link';
import Clarity from '@microsoft/clarity';

export default async function Home() {
  return (
    //background homepage
    <div className="min-h-screen bg-[url('/background.svg')] bg-cover ">
      {/* clarity metrics captation */}
      {/* Clarity.init(projectId);
      Clarity.identify("custom-id", "custom-session-id", "custom-page-id", "friendly-name"); // only custom-id is required
      Clarity.setTag("key", "value");
      Clarity.event("custom-event"); */}
      {/* main content */}
      <div className="flex flex-col items-center gap-6 py-8"> {/* py-8 instead of my-8 so there is no whitespace underneath the background  */}
        {/* banner */}
        <Image
          src="/HomePageImages/homepage_banner.png"
          alt="banner"
          width={893}
          height={245}
          className="w-4/5 h-auto"
        />

        {/* first card */}
        <div className="card bg-white w-4/5 p-8 border border-borderCard rounded-lg shadow-sm">
        
          {/* items in card with gap 4 */}
          <div className="flex flex-col items-center gap-4">

            {/* first paragraph */}
            <p className="text-center text-2xl">Want to stop fast fashion and be more sustainable by making your own beautiful clothes? 
              <br/> Join our <span className='text-txtTransBtn'>step-by-step knitting program</span> and turn your creativity into wearable pieces, 
              <br/> <span className='text-txtTransBtn'> made by you, for you</span>.
            </p>

            {/* Learn button */}
            <div className='flex justify-center'>
              <Link href="/learn/introduction" className='relative'>
                <button className="relative z-10 border border-borderBtn bg-colorBtn rounded-lg 
                text-center text-txtColorBtn text-3xl px-4 py-2  
                hover:bg-white hover:text-txtTransBtn">
                  Learn
                </button>
                <Image
                    src={"/HomePageImages/naalden.svg"}
                    alt="naalden"
                    width={63}
                    height={75}
                    className="absolute right-0 -top-7 translate-x-1/2"
                  />
              </Link>
            </div>
          
            {/* second paragraph */}
            <p className="text-center text-lg">Already ready to take on a project? We offer a tool that helps you track your patterns and gather your ideas. 
              <br/> <span className='text-txtTransBtn'>Let's get creative!</span>
            </p>

            {/* Create button */}
            <div className='flex justify-center'>
              <Link href="/create" className='relative'>
                <button className="relative z-10 border border-borderBtn bg-colorBtn rounded-lg 
                text-center text-txtColorBtn text-lg px-4 py-2  
                hover:bg-white hover:text-txtTransBtn">
                  Create
                </button>
                <Image
                  src={"/HomePageImages/naalden.svg"}
                  alt="naalden"
                  width={43}
                  height={55}
                  className="absolute right-0 -top-5 translate-x-1/2"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* second card */}
        <div className="card bg-white w-4/5 p-8 border border-borderCard rounded-lg shadow-sm">

          {/* items in card with gap 4 */}
          <div className="flex flex-col items-center gap-4">

            {/* first paragraph (calc) */}
            <p className="text-center text-lg">
              Need a hand with project calculations? Our easy-to-use <Link href={"/calculator"} className='text-orange-700 underline hover:font-bold inline-block min-w-[92px] text-center'>calculators</Link> are here to help. 
              <br/> Making your work lighter and your results spot-on!
            </p>

            {/* second paragraph (dict) */}
            <p className="text-center text-lg">
              Curious about a knitting term? Our handy <Link href={"/dictionary"} className='text-orange-700 underline hover:font-bold inline-block min-w-[92px] text-center '>dictionary</Link> is here to guide you. <br/> Helping you navigate the world of knitting with ease!
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}