import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// Secret to validate webhook requests from Sanity
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook secret
    const secret = request.nextUrl.searchParams.get('secret')
    
    if (secret !== SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Revalidate the homepage (which fetches all content)
    revalidatePath('/')
    
    // You can also revalidate specific paths based on the webhook payload
    // const body = await request.json()
    // if (body._type === 'insight') {
    //   revalidatePath('/insights')
    // }

    return NextResponse.json({ 
      revalidated: true, 
      now: Date.now(),
      message: 'Revalidation triggered successfully' 
    })
  } catch (error) {
    console.error('Revalidation error:', error)
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
  }
}

// Also allow GET for testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  if (secret !== SANITY_WEBHOOK_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  revalidatePath('/')
  
  return NextResponse.json({ 
    revalidated: true, 
    now: Date.now() 
  })
}
