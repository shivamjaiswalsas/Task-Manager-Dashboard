import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/utils/auth'

// This would be replaced with actual database in production

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value

        const users: any[] = request.cookies.get("users")?.value
            ? JSON.parse(request.cookies.get("users")!.value)
            : [];


        if (!token) {
            return NextResponse.json(
                { error: 'No token provided' },
                { status: 401 }
            )
        }

        const decoded = verifyToken(token)
        console.log(decoded, "ASdfas")
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        const user = users.find(user => user.id === decoded.userId)
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({ user: userWithoutPassword })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}