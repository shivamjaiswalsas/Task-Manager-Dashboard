import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/app/utils/auth'

// In-memory storage for demonstration

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const { title, description, status, priority, dueDate } = await request.json()

        const taskIndex = tasks.findIndex(
            t => t?.id === params?.id && t?.userId === decoded?.userId
        )

        if (taskIndex === -1) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            )
        }

        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title,
            description,
            status,
            priority,
            dueDate,
            updatedAt: new Date().toISOString(),
        }

        const response = NextResponse.json({ task: tasks[taskIndex] })
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const taskIndex = tasks.findIndex(
            t => t?.id === params?.id && t?.userId === decoded?.userId
        )

        if (taskIndex === -1) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            )
        }

        tasks.splice(taskIndex, 1)

        const response = NextResponse.json({ message: 'Task deleted successfully' })
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