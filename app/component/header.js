import { cookies } from "next/headers";
import Link from "next/link";

// 🎯 Convert this into an async Server Component to safely check browser cookies
export default async function Header() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("session_user_id");

  return (
    <header style={{ 
      padding: '15px 30px', 
      background: '#1a1a1a', 
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #222'
    }}>
      {/* Clicking the title returns you home */}
      <Link href="/" style={{ textDecoration: 'none', color: 'white' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>My Task App</h2>
      </Link>

      <nav>
        {isLoggedIn ? (
          /* 🎯 If logged in, render an interactive Server Action button to log out */
          <form action={async () => {
            'use server';
            const { cookies } = await import("next/headers");
            const cookieStore = await cookies();
            cookieStore.delete("session_user_id");
          }}>
            <button type="submit" className="delete-btn" style={{ fontSize: '14px', padding: '6px 12px' }}>
              Log Out
            </button>
          </form>
        ) : (
          /* 🎯 If logged out, render a navigation link guiding them to your new auth page */
          <Link href="/auth" style={{ 
            color: '#0070f3', 
            textDecoration: 'none', 
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            Sign In
          </Link>
        )}
      </nav>
    </header>
  );
}