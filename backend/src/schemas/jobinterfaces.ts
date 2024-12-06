import type { Job } from "bullmq";

export interface SplitterJob extends Job {
    name: string;
    queueName: string;
    data: {
        topic: string;
    };
}

export interface ConcatJob extends Job {
    name: string;
    queueName: string;
    data: {
        audioFiles: string[];
        animationFiles: string[];
    };
}

export interface AnimationJob extends Job {
    name: string;
    queueName: string;
    data: {
        prompt: string;
    };
}

export interface NarrationJob extends Job {
    name: string;
    queueName: string;
    data: {
        text: string;
    };
}

