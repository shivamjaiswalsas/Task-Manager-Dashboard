import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/utils/auth'

// In-memory storage for demonstration

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value
        const tasks: any[] = request.cookies.get("tasks")?.value
            ? JSON.parse(request.cookies.get("tasks")!.value)
            : [];
        const { searchParams } = new URL(request.url)
        const projectId = searchParams.get('projectId')

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

        let userTasks = tasks.filter(task => task?.userId === decoded?.userId)

        if (projectId) {
            userTasks = userTasks.filter(task => task?.projectId === projectId)
        }

        return NextResponse.json({ tasks: userTasks })
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
        const tasks: any[] = request.cookies.get("tasks")?.value
            ? JSON.parse(request.cookies.get("tasks")!.value)
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

        const { title, description, status, priority, projectId, dueDate } = await request.json()

        const task = {
            id: Date.now().toString(),
            title,
            description,
            status: status || 'todo',
            priority: priority || 'medium',
            projectId,
            userId: decoded.userId,
            dueDate,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        tasks.push(task)

        const response = NextResponse.json({ task })
        response.cookies.set('tasks', JSON.stringify(tasks), {
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