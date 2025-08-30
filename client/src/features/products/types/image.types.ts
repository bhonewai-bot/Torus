export interface UploadedImage {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    isMain: boolean;
}

export interface UpdateImage {
    id?: string;
    url: string;
    isMain: boolean;
}

export interface ExistingImage {
    id: string;
    url: string;
    isMain: boolean;
}

export interface ImageUploadResponse {
    success: boolean;
    message: string;
    data: {
        images: UploadedImage[];
    }
}