import { Cohere } from './models/cohere';
import { Huggingface } from './models/huggingface';
import { OpenAI } from './models/openai';
import { CompletionChoice, CompletionProvider, CompletionRequest, CompletionResponse, ModelCompletionRequest } from './shared/types';
import { flatMap, promiseAllSettled } from './shared/util';

export type ModelOptions = {
    apiKeys?: {
        openAI?: string;
        cohere?: string;
        huggingface?: string;
    }
}

export class LLM {
    private providers: Map<string, CompletionProvider>;

    constructor(options: ModelOptions) {
        this.providers = new Map<string, CompletionProvider>();

        if (options.apiKeys?.openAI) {
            this.registerProvider(new OpenAI(options.apiKeys.openAI));
        }

        if (options.apiKeys?.cohere) {
            this.registerProvider(new Cohere(options.apiKeys.cohere));
        }

        if (options.apiKeys?.huggingface) {
            this.registerProvider(new Huggingface(options.apiKeys.huggingface));
        }
    }

    public registerProvider(provider: CompletionProvider) {
        for (const model of provider.models()) {
            this.providers.set(model, provider)
            this.providers.set(`${provider.name()}/${model}`, provider);
        }
    }

    public async completion(request: CompletionRequest): Promise<CompletionResponse> {
        if (!request.model) {
            throw new Error('No model specified');
        }

        if (!request.prompt) {
            throw new Error('No prompt specified');
        }

        const prompts = Array.isArray(request.prompt) ? request.prompt : [request.prompt];
        const models = Array.isArray(request.model) ? request.model : [request.model];

        const queuedRequests = flatMap(models, (model) => {
            if (!this.providers.has(model)) {
                throw new Error(`No provider for model ${model}, available models: ${Array.from(this.providers.keys()).join(', ')}`);
            }

            const parts = model.split('/');
            const modelName = parts.length > 1 ? parts[1] : parts[0];

            return prompts.map((prompt, idx) => {
                return {
                    ...request,
                    promptIndex: idx,
                    prompt: prompt,
                    model: modelName,
                } as ModelCompletionRequest
            })
        });

        return new Promise(resolve => promiseAllSettled<CompletionChoice>(queuedRequests.map((req, idx) => {
            return this.providers.get(req.model).completion(req).then((response) => {
                return {
                    text: response.completion,
                    index: idx,
                    model: req.model,
                    promptIndex: req.promptIndex,
                    created: response.created,
                } as CompletionChoice
            }).catch((error) => {
                return {
                    index: idx,
                    model: req.model,
                    promptIndex: req.promptIndex,
                    error: JSON.stringify(error.response.data),
                } as CompletionChoice
            })
        })).then((responses) => {
            const choices = responses.map((response) => {
                if (response.status === 'fulfilled') {
                    return response.value;
                } else {
                    throw new Error(JSON.stringify(response));
                }
            });
            resolve({
                created: Date.now(),
                choices: choices,
            })
        }));
    }
}

