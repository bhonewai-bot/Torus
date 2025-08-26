export interface UploadedImage {
    url: string;
    filename: string;
    originalName: string;
    size: number;
    isMain: boolean;
}

export interface ImageUploadResponse {
    success: boolean;
    message: string;
    data: {
        images: UploadedImage[];
    }
}