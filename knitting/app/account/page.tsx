import Image from 'next/image';

export default function Page() {
    return(
        <div className=" bg-bgDefault flex flex-col h-screen space-y-16 items-center py-6 text-txtDefault">
            {/* USER INFO */}
            <div className="card flex bg-white border border-borderCard h-1/3 w-4/5 gap-8 rounded-lg shadow-sm">
                
                <img src="/account.png" alt="account image" className="h-full px-8 py-4" />

                <div className='flex flex-col justify-center gap-6'>
                    <div className='text-2xl font-bold text-txtBold'>FirstName LastName</div>
                    <div className='flex gap-32'>
                        <div>
                            <p className='text-stone-400 text-lg'>Email address:</p>
                            <div className='text-lg'>firstname.lastname@iets.com</div>
                        </div>
                        <div>
                            <p className='text-stone-400 text-lg '>Andere gegevens:</p>
                            <div className='text-lg'>andere gegevens</div>
                        </div>
                    </div>
                </div>

            </div>

            {/* LEARN PROGRESS*/}
            <div className="card flex bg-white border border-borderCard h-2/3 w-4/5 rounded-lg shadow-sm">
                <div className='flex flex-col justify-center gap-6 px-8 py-4'>

                    <div className='text-2xl font-bold text-txtBold'>Learn Progress</div>
                    <div>'Progress bar'</div>
                    <div className='text-lg'>Yay, you are doing good! Keep going!</div>

                </div>
            </div>

            {/* YOUR CREATIONS */}
            <div className="card flex bg-white border border-borderCard h-2/3 w-4/5 rounded-lg shadow-sm">
                <div className='flex flex-col justify-center gap-6 px-8 py-4'>

                    <div className='text-2xl font-bold text-txtBold'>Your Creations</div>
                    <div className='text-lg'>Yay, you already made x creations!</div>
                    <div>'Creations'</div>

                </div>
            </div>
        </div>
    );
}