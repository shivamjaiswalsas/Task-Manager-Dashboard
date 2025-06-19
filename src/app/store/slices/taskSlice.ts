import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Task {
    id: string
    title: string
    description: string
    status: 'todo' | 'in-progress' | 'completed'
    priority: 'low' | 'medium' | 'high'
    projectId: string
    userId: string
    createdAt: string
    updatedAt: string
    dueDate?: string
}

interface TaskState {
    tasks: Task[]
    currentTask: Task | null
    loading: boolean
    filter: {
        status?: string
        priority?: string
        projectId?: string
    }
}

const initialState: TaskState = {
    tasks: [],
    currentTask: null,
    loading: false,
    filter: {},
}

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload
        },
        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload)
        },
        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.tasks.findIndex(t => t.id === action.payload.id)
            if (index !== -1) {
                state.tasks[index] = action.payload
            }
        },
        deleteTask: (state, action: PayloadAction<string>) => {
            state.tasks = state.tasks.filter(t => t.id !== action.payload)
        },
        setCurrentTask: (state, action: PayloadAction<Task | null>) => {
            state.currentTask = action.payload
        },
        setFilter: (state, action: PayloadAction<Partial<TaskState['filter']>>) => {
            state.filter = { ...state.filter, ...action.payload }
        },
    },
})

export const {
    setLoading,
    setTasks,
    addTask,
    updateTask,
    deleteTask,
    setCurrentTask,
    setFilter,
} = taskSlice.actions
export default taskSlice.reducer