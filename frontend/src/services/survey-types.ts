export const categories = [
  'Juniors',
  'Seniors',
  'Adult Males',
  'Adult Females',
] as const

export const sections = ['Flexibility', 'Strength', 'Endurance'] as const

export const sectionActivities = {
  Flexibility: ['Suryanamaskarams'],
  Strength: ['Pushups', 'Plank', 'Squats'],
  Endurance: ['3K Running'],
} as const

export const ratingOptions = [1, 2, 3, 4, 5] as const

export type Category = (typeof categories)[number]
export type SectionName = (typeof sections)[number]
export type ActivityName =
  | 'Suryanamaskarams'
  | 'Pushups'
  | 'Plank'
  | 'Squats'
  | '3K Running'
