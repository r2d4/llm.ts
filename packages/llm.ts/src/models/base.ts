import axios from 'axios';
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
            return axios.post(this.baseUrl, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.apiKey,
                }
            }).then(resp => this.convertResponse(resp.data));
        } catch (error) {
            console.error(error);
        }
    }
}

