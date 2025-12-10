'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserIcon, CheckIcon, XMarkIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

export default function Page({ user, wips }: { user: any, wips: any }) {
  const [profileImage, setProfileImage] = useState(user?.image_url || null);
  const router = useRouter();
  const pathname = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  //state used for subscription
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscription = async (priceId: string) => {
    if (!user) return;

    setSubscriptionStatus('loading');

    try {
        const [response] = await Promise.all([
            fetch('/api/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    userId: user.id, 
                    priceId: priceId
                }),
            }),
            new Promise(resolve => setTimeout(resolve, 1500)) 
        ]);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.errorMessage || 'Subscription failed');
        }
        
        setSubscriptionStatus('success');

    } catch (error) {
        console.error('Subscription error:', error);
        setSubscriptionStatus('error');
    }
  };

  const handleContinue = () => {
      setShowSubscriptionPopup(false);
      setSubscriptionStatus('idle');
      router.refresh();
  };

  //cancel subscription
  const [showCancelPopup, setShowCancelPopup] = useState(false);
  const [cancelStatus, setCancelStatus] = useState<'idle' | 'confirm' | 'loading' | 'success' | 'error'>('idle');

  const handleCancelSubscription = () => {
    if (!user) return;
    
    setShowCancelPopup(true);
    setCancelStatus('confirm'); 
  };

  const executeCancelSubscription = async () => {
    if (!user) return;
    
    // Ga over naar de loading state
    setCancelStatus('loading');

    try {
      const [response] = await Promise.all([
        fetch('/api/cancel-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userId: user.id
          }),
        }),
        new Promise(resolve => setTimeout(resolve, 1500)) 
      ]);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errorMessage || 'Cancellation failed');
      }
      
      setCancelStatus('success');

    } catch (error) {
      console.error('Cancellation error:', error);
      setCancelStatus('error');
    }
  };

  const handleCancelContinue = () => {
    setShowCancelPopup(false);
    setCancelStatus('idle');
    router.refresh();
  };

  let progress = (user?.learn_process - 1) || 0;
  if (progress < 0) progress = 0;
  let progressPercent = Math.round((progress / 7) * 100);
  if (progressPercent > 100) {
    progressPercent = 100;
  }
  let progressMessage = "";
  if (progressPercent === 0) {
    progressMessage = "Let's get started! Your journey awaits";
  } else if (progressPercent > 0 && progressPercent <= 20) {
    progressMessage = "Good start! Keep going!";
  } else if (progressPercent > 20 && progressPercent <= 50) {
    progressMessage = "You're making solid progress!";
  } else if (progressPercent > 50 && progressPercent < 100) {
    progressMessage = "Awesome! You're more than halfway there!";
  } else if (progressPercent === 100) {
    progressMessage = "Congratulations! You completed everything!";
  }
  useEffect(() => {
    if (user === null || user === undefined) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [user, router, pathname]);
  if (!user) return null;
    const handleImageClick = () => fileInputRef.current?.click();
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", user.id.toString());
    const res = await fetch("/api/users/upima", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (data.url) setProfileImage(data.url); 
  };
  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    
    try {
      const response = await fetch('/api/logout', { method: 'GET' });
      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        console.error("Logout failed with status:", response.status);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
    <div className="bg-bgDefault flex flex-col space-y-12 items-center p-6 text-txtDefault">
      {/* PREMIUM UPGRADE BANNER */}
      {user && !user.hasPremium && (
          <div className="card flex flex-row items-center justify-between bg-white border border-borderBtn h-auto w-4/5 rounded-lg shadow-sm p-6 mb-0">
              <div>
                  <h2 className="text-2xl font-bold text-txtBold mb-1">
                      Unlock Unlimited Creativity!
                  </h2>
                  <p className="text-lg text-txtDefault">
                      Get premium to enjoy unlimited WIPs, Vision Boards, and Pattern Queue slots.
                  </p>
              </div>
              <button
                  onClick={() => setShowSubscriptionPopup(true)}
                  className="px-6 py-3 bg-colorBtn text-txtColorBtn border border-borderBtn rounded-lg hover:bg-transparent hover:text-txtTransBtn transition"
              >
                  Upgrade Now
              </button>
          </div>
      )}
      {/* USER INFO */}
      <div className="card flex flex-row bg-white border border-borderCard h-1/3 w-4/5 gap-8 rounded-lg shadow-sm">
        <div
          className="relative cursor-pointer group mx-8 my-4"
          onClick={handleImageClick}
        >
          <div className="h-48 w-48 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
            {profileImage ? (
              <img
                src={profileImage}
                alt="account image"
                className="h-full w-full object-cover"
              />
            ) : (
              <UserIcon className="h-32 w-32 text-gray-500" />
            )}
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <span className="text-white font-semibold">Change</span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6">
          <div className="text-2xl font-bold text-txtBold">
            {user?.first_name} {user?.last_name}
          </div>

          <div className="flex gap-32">
            <div>
              <p className="text-txtSoft text-lg">Email:</p>
              <div className="text-lg">{user?.email}</div>
            </div>
            <div>
              <p className="text-txtSoft text-lg">Username:</p>
              <div className="text-lg">{user?.username}</div>
            </div>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <div className="flex justify-end mt-auto ml-auto mr-6">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="p-2 mb-6 bg-transparent text-txtTransBtn border border-borderBtn rounded-lg hover:bg-colorBtn hover:text-txtColorBtn transition"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

       {/* LEARN PROGRESS */}
        <div className="card flex flex-col bg-white border border-borderCard h-2/3 w-4/5 rounded-lg shadow-sm px-6 py-6">
          <div className="text-2xl font-bold text-txtBold mb-6">Learning Progress</div>
          <div className="flex flex-row justify-between items-center w-full ">
              <div className="flex flex-col w-2/3 gap-4">
                <div className="relative bg-stone-300 rounded-full h-6 w-full">
                    <div
                    className="bg-colorBtn h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center font-semibold text-sm">
                    {progressPercent}%
                    </span>
                </div>
                <div className="text-lg font-medium">
                    {progressMessage}
                </div>
              </div>
              <div className="flex justify-end mt-auto ml-auto">
                <button
                    onClick={() => window.location.href = '/learn/introduction'}
                    className="px-4 py-2 bg-colorBtn text-txtColorBtn border border-borderBtn rounded-lg hover:bg-white hover:text-txtTransBtn transition"
                >
                    Get back to learning
                </button>
              </div>
          </div>
        </div>

      {/* YOUR CREATIONS */}
      <div className="card flex flex-col bg-white border border-borderCard h-2/3 w-4/5 rounded-lg shadow-sm px-8 py-4">
        <div className="text-2xl font-bold text-txtBold mb-4">Your Creations</div>
        <div className="grid grid-cols-3 gap-6">
          {wips.length === 0 && <p className="col-span-3 text-center">No finished creations yet.</p>}
          {wips.map((wip: any) => (
            <div key={wip.wipID} className="flex flex-col items-center bg-bgDefault p-2 rounded">
              <div className="text-lg font-semibold mb-2 text-center">{wip.wipName}</div>
              <img src={wip.wipPictureURL} alt={wip.wipName} className="h-40  object-cover rounded" />
            </div>
          ))}
        </div>
      </div>

{/* CANCEL SUBSCRIPTION LINK/BUTTON */}
      {user && user.hasPremium && (
        <div className="w-4/5 flex justify-end mt-4">
          <button
            onClick={handleCancelSubscription}
            className="text-sm text-txtSoft underline hover:text-txtTransBtn"
          >
            Cancel Subscription
          </button>
        </div>
      )}

    </div>

{/* Annulerings Status & Bevestigings Popup Overlay */}
    {showCancelPopup && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        
        {/* VASTE KLEINE CONTAINER: w-96 en bg-white voor ALLE statussen (Confirm, Loading, Success, Error) */}
        <div className={`
          bg-white rounded-lg shadow-lg p-6 w-96 text-center mx-4 relative 
        `}>
          
          {/* Close button - Toont alleen voor Success/Error/Idle. (Geen knop in Loading en Confirm). */}
          {cancelStatus !== 'loading' && cancelStatus !== 'confirm' && (
            <button
              onClick={() => {
                setShowCancelPopup(false);
                setCancelStatus('idle');
                if (cancelStatus === 'success') {
                  router.refresh();
                }
              }}
              className="absolute top-4 right-4 text-txtDefault hover:text-txtTransBtn transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}

          {/* CONFIRMATION STATE (Inhoud blijft hetzelfde) */}
          {cancelStatus === 'confirm' && (
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold mb-4">Are you sure you want to cancel your premium subscription?</h2>
              <p className="text-sm text-stone-600 mb-6">
                This action cannot be undone. You will lose access to unlimited features.
              </p>
              
              <div className="flex justify-center gap-4">
                {/* KNOP 1: 'Yes, Cancel'  */}
                <button
                  onClick={executeCancelSubscription}
                  className="px-6 py-2 border border-borderBtn bg-transparent text-txtTransBtn rounded-lg hover:bg-colorBtn hover:text-txtColorBtn transition shadow-sm"
                >
                  Yes
                </button>
                
                {/* KNOP 2: 'Cancel'  */}
                <button
                  onClick={() => {
                    setShowCancelPopup(false); 
                    setCancelStatus('idle'); 
                  }}
                  className="px-6 py-2 border border-colorBtn bg-colorBtn text-white rounded-lg hover:opacity-90 transition shadow-sm hover:bg-transparent hover:text-txtTransBtn"
                >
                  No 
                </button>
              </div>
            </div>
          )}

          {/* LOADING STATE (Aangepast voor de kleine popup) */}
          {cancelStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8">
              <ArrowPathIcon className="w-12 h-12 text-colorBtn animate-spin mb-4" />
              <p className="text-txtDefault text-base">Processing...</p>
            </div>
          )}

          {/* SUCCESS STATE (Aangepast voor de kleine popup) */}
          {cancelStatus === 'success' && (
            <div className="flex flex-col items-center justify-center">
              <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-txtBold mb-2">Cancelled!</h3>
              <p className="text-sm text-txtDefault mb-4">
                Subscription removed successfully.
              </p>
              <button
                onClick={handleCancelContinue}
                className="mt-2 px-4 py-2 border border-borderBtn text-txtColorBtn rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition"
              >
                Continue
              </button>
            </div>
          )}

          {/* ERROR STATE (Aangepast voor de kleine popup) */}
          {cancelStatus === 'error' && (
            <div className="flex flex-col items-center justify-center">
              <XMarkIcon className="w-12 h-12 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-txtBold mb-2">Error</h3>
              <p className="text-sm text-txtDefault mb-4">
                Could not process cancellation.
              </p>
              <button
                onClick={() => setCancelStatus('idle')}
                className="mt-2 px-4 py-2 border border-borderBtn text-txtColorBtn rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition"
              >
                Try Again
              </button>
            </div>
          )}
          
        </div>
      </div>
    )}

    {/* Abonnements Popup Overlay */}
    {showSubscriptionPopup && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        
        <div className="bg-bgDefault rounded-lg p-8 max-w-4xl w-full mx-4 shadow-sm relative min-h-[600px] flex flex-col">
          
          {/* Close button - niet tonen tijdens loading */}
          {subscriptionStatus !== 'loading' && (
            <button
              onClick={() => {
                setShowSubscriptionPopup(false);
                setSubscriptionStatus('idle');
                if (subscriptionStatus === 'success') {
                  router.refresh();
                }
              }}
              className="absolute top-4 right-4 text-txtDefault hover:text-txtTransBtn transition"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
          
          {/* IDLE STATE - Subscription opties */}
          {subscriptionStatus === 'idle' && (
            <>
              <h2 className="text-3xl font-bold text-txtBold mb-8 text-center">Unlock Unlimited Creativity</h2>
              
              <div className="grid grid-cols-3 gap-6">
                
                {/* === FREE VERSION === */}
                <div className="border border-borderCard p-6 rounded-lg flex flex-col justify-between bg-bgDefault shadow-sm">
                  <div className='mb-6'>
                    <h3 className="text-xl font-bold text-txtBold mb-2">Free Version</h3>
                    <p className="text-4xl font-extrabold text-colorBtn mb-4">€0</p>
                    <p className="text-txtSoft mb-6">Start with the basics.</p>
                    
                    <ul className="space-y-2 text-txtDefault">
                      <li className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-2 text-colorBtn" /> 3 Active WIPs
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-2 text-colorBtn" /> 3 Vision Boards
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-2 text-colorBtn" /> 3 Patterns in Queue
                      </li>
                    </ul>
                  </div>
                  <div className="pt-2">
                      <p className="text-sm text-txtSoft text-center">Your current plan.</p>
                  </div>
                </div>

                {/* === MONTHLY PREMIUM === */}
                <div className="border border-borderBtn p-6 rounded-lg flex flex-col justify-between bg-bgSidebar shadow-sm relative">
                  <div className='mb-6'>
                    <h3 className="text-xl font-bold text-txtBold mb-2">Monthly Premium</h3>
                    <p className="text-4xl font-extrabold text-colorBtn mb-4">€5.99</p> 
                    <p className="text-txtSoft mb-6">/ month</p>
                    
                    <ul className="space-y-2 text-txtDefault">
                      <li className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-2 text-colorBtn" /> Unlimited WIPs
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-2 text-colorBtn" /> Unlimited Vision Boards
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-2 text-colorBtn" /> Unlimited Patterns in Queue
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleSubscription('price_monthly')}
                    className="w-full border border-borderBtn text-txtColorBtn px-4 py-2 rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition"
                  >
                    Select Monthly
                  </button>
                </div>

                {/* === YEARLY PREMIUM === */}
                <div className="border border-borderBtn p-6 rounded-lg flex flex-col justify-between bg-bgSidebar shadow-sm relative">
                  {/* Most Popular Tag */}
                  <div className="absolute top-0 right-0 bg-colorBtn text-txtColorBtn text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Most Popular
                  </div>
                  <div className='mb-6'>
                    <h3 className="text-xl font-bold text-txtBold mb-2">Yearly Premium</h3>
                    {/* Doorgestreepte prijs (maandelijkse prijs) */}
                    <p className="text-lg text-txtSoft mb-1"><span className="line-through">€5.99</span> / month</p> 
                    <p className="text-4xl font-extrabold text-colorBtn mb-4">€3.99</p> 
                    <p className="text-sm text-txtSoft mb-6">(Billed €47.88 annually)</p>
                    
                    <ul className="space-y-2 text-txtDefault">
                      <li className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-2 text-colorBtn" /> Unlimited WIPs
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-2 text-colorBtn" /> Unlimited Vision Boards
                      </li>
                      <li className="flex items-center">
                        <CheckIcon className="w-5 h-5 mr-2 text-colorBtn" /> Unlimited Patterns in Queue
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => handleSubscription('price_yearly')}
                    className="w-full border border-borderBtn text-txtColorBtn px-4 py-2 rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition"
                  >
                    Select Yearly
                  </button>
                </div>
                
              </div>
            </>
          )}

          {/* LOADING STATE */}
          {subscriptionStatus === 'loading' && (
            <div className="flex flex-col items-center justify-center flex-1">
              <ArrowPathIcon className="w-16 h-16 text-colorBtn animate-spin mb-4" />
              <p className="text-xl text-txtDefault">Processing your subscription...</p>
            </div>
          )}

          {/* SUCCESS STATE */}
          {subscriptionStatus === 'success' && (
            <div className="flex flex-col items-center justify-center flex-1">
              <CheckCircleIcon className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-2xl font-bold text-txtBold mb-2">Welcome to Premium!</h3>
              <p className="text-txtDefault mb-6 text-center">
                You now have unlimited access to all features.
              </p>
              <button
                onClick={handleContinue}
                className="px-6 py-2 border border-borderBtn text-txtColorBtn rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition"
              >
                Continue
              </button>
            </div>
          )}

          {/* ERROR STATE */}
          {subscriptionStatus === 'error' && (
            <div className="flex flex-col items-center justify-center flex-1">
              <XMarkIcon className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-2xl font-bold text-txtBold mb-2">Something went wrong</h3>
              <p className="text-txtDefault mb-6 text-center">
                We couldn't process your subscription. Please try again.
              </p>
              <button
                onClick={() => setSubscriptionStatus('idle')}
                className="px-6 py-2 border border-borderBtn text-txtColorBtn rounded-lg bg-colorBtn hover:bg-transparent hover:text-txtTransBtn transition"
              >
                Try Again
              </button>
            </div>
          )}
          
        </div>
        
      </div>
    )}

    </>
  );
}