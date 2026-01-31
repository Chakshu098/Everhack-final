import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "./ui/button";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-background">
                    <h1 className="text-3xl font-bold mb-4 text-destructive">Something went wrong</h1>
                    <p className="text-muted-foreground mb-6 max-w-md">
                        We encountered an unexpected error. Please try reloading the page.
                    </p>
                    <div className="bg-muted p-4 rounded-md mb-6 text-left overflow-auto max-w-2xl w-full">
                        <code className="text-sm text-destructive font-mono">
                            {this.state.error?.toString()}
                        </code>
                    </div>
                    <div className="flex gap-4">
                        <Button onClick={() => window.location.reload()}>Reload Page</Button>
                        <Button variant="outline" onClick={() => window.location.href = "/"}>
                            Go Home
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
