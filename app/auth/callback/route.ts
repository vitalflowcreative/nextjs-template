import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const next = requestUrl.searchParams.get('next') ?? '/dashboard'

    if (!code) {
      return NextResponse.redirect(new URL(`/auth?error=missing_code&next=${next}`, requestUrl.origin))
    }

    const supabase = await createClient()
    
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth error:', error)
      return NextResponse.redirect(
        new URL(`/auth?error=${error.message}&next=${next}`, requestUrl.origin)
      )
    }

    return NextResponse.redirect(new URL(next, requestUrl.origin))
  } catch (error) {
    // If we get a header error, clear the cookies and redirect to auth
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL('/auth?error=callback_error', request.url)
    )
  }
} 