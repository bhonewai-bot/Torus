export const getUserInitials = (name: string): string => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
};

export const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const capitalizeFirst = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};