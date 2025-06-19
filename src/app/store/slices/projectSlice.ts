import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Project {
    id: string
    name: string
    description: string
    userId: string
    createdAt: string
    updatedAt: string
}

interface ProjectState {
    projects: Project[]
    currentProject: Project | null
    loading: boolean
}

const initialState: ProjectState = {
    projects: [],
    currentProject: null,
    loading: false,
}

const projectSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setProjects: (state, action: PayloadAction<Project[]>) => {
            state.projects = action.payload
        },
        addProject: (state, action: PayloadAction<Project>) => {
            state.projects.push(action.payload)
        },
        updateProject: (state, action: PayloadAction<Project>) => {
            const index = state.projects.findIndex(p => p.id === action.payload.id)
            if (index !== -1) {
                state.projects[index] = action.payload
            }
        },
        deleteProject: (state, action: PayloadAction<string>) => {
            state.projects = state.projects.filter(p => p.id !== action.payload)
        },
        setCurrentProject: (state, action: PayloadAction<Project | null>) => {
            state.currentProject = action.payload
        },
    },
})

export const {
    setLoading,
    setProjects,
    addProject,
    updateProject,
    deleteProject,
    setCurrentProject,
} = projectSlice.actions
export default projectSlice.reducer