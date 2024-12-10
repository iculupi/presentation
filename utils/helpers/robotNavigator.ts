import axios from 'axios';
import type { RobotResponse, Position, StepInfo } from '../types';
import * as path from 'path';
import * as fs from 'fs/promises';

export class RobotHelper {
    static calculateNewPosition(currentPosition: Position, step: string): Position {
        const { x, y } = currentPosition;
        switch (step) {
            case 'UP': return { x, y: y + 1 };
            case 'DOWN': return { x, y: y - 1 };
            case 'LEFT': return { x: x - 1, y };
            case 'RIGHT': return { x: x + 1, y };
            default: return { x, y };
        }
    }

    static getPositionDescription(position: Position): string {
        return `(${position.x},${position.y})`;
    }

    static trackSteps(steps: string[]): StepInfo[] {
        let currentPosition: Position = { x: 0, y: 0 };
        const stepDetails: StepInfo[] = [];

        steps.forEach((step, index) => {
            const newPosition = this.calculateNewPosition(currentPosition, step);
            stepDetails.push({
                step,
                position: newPosition,
                description: `Step ${index + 1}: ${step} -> ${this.getPositionDescription(newPosition)}`
            });
            currentPosition = newPosition;
        });

        return stepDetails;
    }

    static formatStepDetails(stepDetails: StepInfo[]): string {
        return stepDetails.map(detail => detail.description).join('\n');
    }

    static async sendStepsToRobot(apiUrl: string, steps: string[]): Promise<{ success: boolean; response?: any }> {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const requestBody = {
                "steps": "UP, UP, RIGHT, RIGHT, DOWN, DOWN, RIGHT, RIGHT, RIGHT"
            };

            // Zapisz wysyłane dane
            await fs.mkdir(path.join(__dirname, '../../exercises/004/api_responses'), { recursive: true });
            await fs.writeFile(
                path.join(__dirname, `../../exercises/004/api_responses/request_${timestamp}.json`),
                JSON.stringify(requestBody, null, 2)
            );

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            // Zapisz otrzymaną odpowiedź
            const responseData = await response.text();
            await fs.writeFile(
                path.join(__dirname, `../../exercises/004/api_responses/response_${timestamp}.json`),
                JSON.stringify({
                    status: response.status,
                    data: responseData
                }, null, 2)
            );

            if (response.status === 200) {
                return { success: true, response: { status: response.status } };
            }

            return { success: false, response: { status: response.status } };
        } catch (error) {
            console.error('Error sending steps to robot:', error);
            return { success: false };
        }
    }

    static getGuidedDescription(previousAttempts: string = '', previousSteps?: StepInfo[]): string {
        const base = `You are a robot in a warehouse. You need to reach the computer with factory data.
        You can only use these commands: UP, DOWN, LEFT, RIGHT.
        The path to the computer is: go right twice, then up three times, then right once more.
        Your previous attempts have failed, so try to find a different approach.
        Consider walls and obstacles that might have blocked your path.
        Return ONLY the steps array in JSON format.`;

        let description = base;
        if (previousSteps?.length) {
            description += `\n\nYour last attempt failed at position ${this.getPositionDescription(previousSteps[previousSteps.length - 1].position)}`;
            description += `\n\nStep by step details:\n${this.formatStepDetails(previousSteps)}`;
        }
        if (previousAttempts) {
            description += `\n\nPrevious attempts and outcomes:\n${previousAttempts}`;
        }

        return description;
    }

    static getAutonomousDescription(previousAttempts: string = '', previousSteps?: StepInfo[]): string {
        const base = `You are an autonomous robot in a warehouse. Your goal is to reach the computer with factory data.
        The warehouse layout:
        - You start at position (0,0) in the bottom-left corner
        - The computer is at position (3,3)
        - You can only move using: UP, DOWN, LEFT, RIGHT commands
        - The warehouse is a 4x4 grid
        - There are no obstacles
        Consider previous attempts and their outcomes to improve your path.
        Plan your path and return the steps in JSON format.`;

        let description = base;
        if (previousSteps?.length) {
            description += `\n\nLast attempt step by step:\n${this.formatStepDetails(previousSteps)}`;
        }
        if (previousAttempts) {
            description += `\n\nPrevious attempts:\n${previousAttempts}`;
        }

        return description;
    }
} 