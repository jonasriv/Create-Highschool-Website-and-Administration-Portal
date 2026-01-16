'use client';

export default function Spinner () {
    return (
        <div className="w-6 h-6 border-t-blue-500 border-4 border-b-orange-500 border-l-red-300 border-r-green-700 animate-spin flex justify-center items-center rounded-full">
            <div className="min-w-6 min-h-6 bg-transparent rounded-full">
            </div>
        </div>
    )
}