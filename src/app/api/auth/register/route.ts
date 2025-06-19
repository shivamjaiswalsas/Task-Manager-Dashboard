import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { generateToken } from '@/app/utils/auth'

// In-memory storage for demonstration

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json()
        const users = request.cookies.get("users")?.value
            ? JSON.parse(request.cookies.get("users")!.value)
            : [];

        // Check if user already exists
        const existingUser = users.find((user: any) => user?.email === email)
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create user
        const user = {
            id: Date.now().toString(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        }

        users.push(user)


        // Generate token
        const token = generateToken(user.id)

        // Return user without password
        const { password: _, ...userWithoutPassword } = user

        const response = NextResponse.json({
            message: 'User created successfully',
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

        response.cookies.set('users', JSON.stringify(users), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })

        return response
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}