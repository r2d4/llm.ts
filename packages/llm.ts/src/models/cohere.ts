import { MODEL, ModelCompletionRequest, ModelCompletionResponse } from "../shared/types";
import { AbstractBaseModel } from "./base";

export enum CohereModels {
    COMMAND_NIGHTLY = 'command-nightly',
    COMMAND = 'command',
    COMMAND_LIGHT = 'command-light',
    COMMAND_LIGHT_NIGHTLY = 'command-light-nightly',
}

type CohereCompletionRequest = {
    prompt: string;
    model: string;
    num_generations?: number;
    max_tokens?: number;
    preset?: string;
    temperature?: number;
    k?: number;
    p?: number;
    frequency_penalty?: number;
    presence_penalty?: number;
    end_sequences?: string;
    stop_sequences?: string[];
    return_likelihoods?: boolean;
    logit_bias?: { [key: string]: number };
    truncate?: string;
}

type CohereCompletionResponse = {
    id: string;
    generations: {
        id: string;
        text: string;
    }[];
    prompt: string;
    meta: {
        apiVersion: {
            version: string;
        }
    }
}

export class Cohere extends AbstractBaseModel {
    constructor(apiKey: string, baseUrl = 'https://api.cohere.ai/v1/generate') {
        super(apiKey, baseUrl);
    }

    name(): string {
        return 'cohere';
    }

    models(): string[] {
        return [
            MODEL.COHERE_COMMAND,
            MODEL.COHERE_COMMAND_NIGHTLY,
            MODEL.COHERE_COMMAND_LIGHT,
            MODEL.COHERE_COMMAND_LIGHT_NIGHTLY
        ];
    }


    convertRequest(request: ModelCompletionRequest): CohereCompletionRequest {
        return {
            prompt: request.prompt,
            model: request.model,
            max_tokens: request.maxTokens,
            temperature: request.temperature,
            p: request.topP,
            k: request.topK,
            frequency_penalty: request.frequencyPenalty,
            presence_penalty: request.presencePenalty,
            stop_sequences: request.stopSequences,
        }
    }

    convertResponse(response: CohereCompletionResponse): ModelCompletionResponse {
        return {
            created: Date.now(),
            completion: response.generations[0].text,
        }
    }
}
