import { cn } from "@/lib/utils";

interface GlitchTextProps {
    text: string;
    className?: string;
}

export function GlitchText({ text, className }: GlitchTextProps) {
    return (
        <div className="glitch-wrapper">
            <span
                className={cn("glitch relative inline-block text-transparent bg-clip-text", className)}
                data-text={text}
                style={{ color: 'transparent' }} // Ensure original text is hidden so before/after shine through or overlay correctly
            >
                <span className="invisible">{text}</span>
                <span className="absolute top-0 left-0 text-foreground mix-blend-screen">{text}</span>
            </span>
        </div>
    );
}
