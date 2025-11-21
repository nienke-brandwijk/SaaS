    'use client';

    export const dynamic = 'force-dynamic';

    import { ChangeEvent, FormEvent, useState } from 'react';
    import { useRouter, useSearchParams } from "next/navigation";

    export default function Page() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [statusMessage, setStatusMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const userRouter = useRouter();
    const searchParams = useSearchParams();
    const redirectUrl = searchParams.get('redirect') || '/';
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            setStatusMessage('Please fill in all fields.');
            setIsError(true);
            return;
        }
        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok) {
                userRouter.push(redirectUrl);
                userRouter.refresh();
                setStatusMessage('');
                setIsError(false);
                setFormData({   
                email: '',
                password: '',
                });
            } else {
                setStatusMessage(data.error || data.errorMessage || 'Sign in failed.');
                setIsError(true);
            }
        } catch (error: any) {
            console.error('Error:', error);
            setStatusMessage('Something went wrong');
            setIsError(true);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-screen bg-bgDefault text-txtDefault">
        <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-lg shadow-sm w-full max-w-md"
        >
            <h1 className="text-2xl font-bold text-txtBold text-center mb-6">Sign In</h1>
            {isError && statusMessage && (
            <div className="mb-4 p-3 rounded-lg text-center text-sm font-medium bg-red-100 text-red-700 border border-red-400">
                {statusMessage}
            </div>
            )}
            <div className="mb-4">
            <label className="block mb-1 font-medium" htmlFor="email">
                Email
            </label>
            <input
                id="email"
                name="email"
                type="text"
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-borderCard rounded-lg p-2"
                placeholder="Enter your email"
            />
            </div>
            <div className="mb-6">
            <label className="block mb-1 font-medium" htmlFor="password">
                Password
            </label>
            <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-borderCard rounded-lg p-2"
                placeholder="Enter your password"
            />
            </div>
            <button
            type="submit"
            className="w-full bg-colorBtn text-txtColorBtn border border-borderBtn hover:bg-white hover:text-txtTransBtn font-semibold py-2 px-4 rounded-lg"
            >
            Sign In
            </button>
            <p className="text-center text-sm">
                Don't have an account yet?{' '}
                <a
                    href="/register"
                    className="text-txtTransBtn hover:underline font-medium"
                >
                Register
                </a>
            </p>
        </form>
        </div>
    );
    }