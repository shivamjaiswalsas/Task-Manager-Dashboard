import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/utils/auth'

// In-memory storage for demonstration

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const project = projects.find(
            p => p?.id === params?.id && p?.userId === decoded?.userId
        )

        if (!project) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ project })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const projectIndex = projects.findIndex(
            p => p?.id === params?.id && p?.userId === decoded?.userId
        )

        if (projectIndex === -1) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            )
        }

        projects[projectIndex] = {
            ...projects[projectIndex],
            name,
            description,
            updatedAt: new Date().toISOString(),
        }

        const response = NextResponse.json({ project: projects[projectIndex] })
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const projectIndex = projects.findIndex(
            p => p?.id === params?.id && p?.userId === decoded?.userId
        )

        if (projectIndex === -1) {
            return NextResponse.json(
                { error: 'Project not found' },
                { status: 404 }
            )
        }

        projects.splice(projectIndex, 1)

        const response = NextResponse.json({ message: 'Project deleted successfully' })
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