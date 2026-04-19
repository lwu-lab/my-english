/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskCategory = 'Listening' | 'Speaking' | 'Reading' | 'Writing' | 'Pronunciation';

export interface Resource {
  type: 'youtube' | 'pdf' | 'link';
  title: string;
  url: string;
}

export interface Task {
  id: string;
  category: TaskCategory;
  title: string;
  duration: number; // in minutes
  description: string;
  whatToDo: string;
  whatToSay?: string;
  whatToListen?: string;
  whatToWrite?: string;
  minimumVersion?: string;
  resources: Resource[];
  isCompleted: boolean;
}

export interface DailyGoal {
  title: string;
  description: string;
}

export interface DayPlan {
  dayNumber: number;
  judgment: {
    yesterdayReview: string;
    todayFocus: string;
    dayType: 'Advance' | 'Consolidate' | 'Review' | 'Light';
    reasoning: string;
  };
  tasks: Task[];
  goals: DailyGoal[];
  vocabulary: {
    word: string;
    translation: string;
    explanation: string;
    example: string;
    isMustSpeak: boolean;
  }[];
  errorsToWatch: string[];
  checkInFormat: string;
}
