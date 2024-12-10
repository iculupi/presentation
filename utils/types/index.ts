export interface TestItem {
    question: string;
    answer?: number | string;
    test?: {
        q: string;
        a: string;
    };
}

export interface TaskSubmission {
    task: string;
    apikey: string;
    answer: JsonData;
}

export interface JsonData {
    apikey: string;
    description: string;
    copyright: string;
    'test-data': TestItem[];
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: any;
}

export interface NavigationLog {
    timestamp: string;
    thoughts: string;
    steps: string[];
    stepDetails?: StepInfo[];
    success?: boolean;
    finalPosition?: Position;
}

export interface RobotResponse {
    steps: string[];
    thoughts?: string;
}

export interface Position {
    x: number;
    y: number;
}

export interface StepInfo {
    step: string;
    position: Position;
    description: string;
} 