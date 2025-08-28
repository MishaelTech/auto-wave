export const Spinner = ({ size = "md", color = "blue-500" }: { size?: "sm" | "md" | "lg"; color?: string }) => {
    const sizeClasses = {
        sm: "w-4 h-4 border-2",
        md: "w-6 h-6 border-2",
        lg: "w-8 h-8 border-4",
    };

    return (
        <div
            className={`animate-spin ${sizeClasses[size]} border-t-transparent border-${color} rounded-full justify-center items-center`}
            role="status"
            aria-label="Loading"
        ></div>
    );
};
