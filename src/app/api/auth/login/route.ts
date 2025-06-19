import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/app/utils/auth'

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json()
        const users: any[] = request.cookies.get("users")?.value
            ? JSON.parse(request.cookies.get("users")!.value)
            : [];
        // Find user
        const user = users.find(user => user.email === email)
        if (!user) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        // Generate token
        const token = generateToken(user.id)

        // Return user without password
        const { password: _, ...userWithoutPassword } = user

        const response = NextResponse.json({
            message: 'Login successful',
            user: userWithoutPassword,
            token,
        })

        // Set cookie
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        })

        return response
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}