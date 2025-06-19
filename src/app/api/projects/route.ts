import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/utils/auth'

// In-memory storage for demonstration

export async function GET(request: NextRequest) {
    try {
        const projects: any[] = request.cookies.get("projects")?.value
            ? JSON.parse(request.cookies.get("projects")!.value)
            : [];
        const token = request.cookies.get('token')?.value

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        const userProjects = projects.filter(project => project.userId === decoded.userId)
        return NextResponse.json({ projects: userProjects })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value
        const projects: any[] = request.cookies.get("projects")?.value
            ? JSON.parse(request.cookies.get("projects")!.value)
            : [];
        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const decoded = verifyToken(token)
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            )
        }

        const { name, description } = await request.json()

        const project = {
            id: Date.now().toString(),
            name,
            description,
            userId: decoded.userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
        const response = NextResponse.json({
            project
        })
        projects.push(project)
        response.cookies.set('projects', JSON.stringify(projects), {
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