// import { supabase } from '@/src/supabaseClient'

// export default async function Home() {
//   const { data, error } = await supabase.from('summaries').select('*').limit(5)

//   console.log('Summaries:', data)

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-24">
//       <h1 className="text-white">Quiz3 Landing Page</h1>
//       {error && <p>Error fetching summaries: {error.message}</p>}
//       <ul>
//         {data && data.map((summary) => (
//           <li key={summary.id.toString()}>{summary.title}{summary.summary_text}</li>
//         ))}
//       </ul>
//     </main>
//   )
// }

"use client";

import Link from 'next/link'
import './globals.css'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black font-space-grotesk text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 text-cyan-400">Cysic Quiz</h1>
      <p className="text-lg mb-8 text-gray-300 text-center max-w-md">
Read quick summaries about Cysic, quiz yourself instantly to lock in the knowledge.      </p>
      <Link href="/quiz">
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg text-lg transition">
          Start Quiz
        </button>
      </Link>
     
     <Footer />
    </main>
  )
}
