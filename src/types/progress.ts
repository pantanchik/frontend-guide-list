export interface ProgressUpdate {
  instruction_id: number
  last_completed_step: number
  is_completed: boolean
  session_id: string
}

export interface StoredProgress {
  lastCompletedStep: number
  activeStepNumber: number
  isCompleted: boolean
}
