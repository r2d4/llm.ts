import { ModelCompletionRequest, ModelCompletionResponse } from "../shared/types";

export abstract class AbstractBaseModel {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, baseUrl: string) {
        this.apiKey = apiKey;
        this.baseUrl = baseUrl;
    }

    abstract convertRequest(request: ModelCompletionRequest): any;
    abstract convertResponse(response: any): ModelCompletionResponse;

    public async completion(request: ModelCompletionRequest): Promise<ModelCompletionResponse> {
        const data = this.convertRequest(request);
        try {
            return fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.apiKey,
                },
                body: JSON.stringify(data),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`HTTP error ${response.status}`);
                    }
                    return response.json();
                })
                .then((responseData) => this.convertResponse(responseData));
        } catch (error) {
            console.error(error);
        }
    }
}

