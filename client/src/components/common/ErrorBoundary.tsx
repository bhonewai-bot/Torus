"use client";

import { ErrorHandler } from "@/lib/errors";
import React from "react";

const errorHandler = new ErrorHandler();

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error, resetError: () => void }>
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        errorHandler.handle(error, {
            context: "error_boundary",
            componentStack: errorInfo.componentStack,
            errorBoundary: this.constructor.name
        });
    }

    resetError = () => {
        this.setState({ hasError: false, error: undefined });
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            const FallbackComponent = this.props.fallback;
            if (FallbackComponent && this.state.error) {
                return <FallbackComponent error={this.state.error} resetError={this.resetError} />
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-gray-800">
                                    Something went wrong
                                </h3>
                                <div className="mt-2 text-sm text-gray-500">
                                    <p>We apologize for the inconvenience. Please try refreshing the page.</p>
                                </div>
                                <div className="mt-4">
                                    <button
                                        onClick={this.resetError}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700 transition ease-in-out duration-150"
                                    >
                                        Try again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children;
    }
}