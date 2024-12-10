import type { Job } from "bullmq";

export interface ConcatJob extends Job {
    name: string;
    queueName: string;
    data: {
        narrationFiles: string[];
        animationFiles: string[];
    };
}

export interface AnimationJob extends Job {
    name: string;
    queueName: string;
    data: {
        prompt: string;
        index: number;
    };
}

export interface NarrationJob extends Job {
    name: string;
    queueName: string;
    data: {
        text: string;
        index: number;
    };
}

