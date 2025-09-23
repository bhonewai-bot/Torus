export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", options);
}

export const formatTime = (dateString: string, options: Intl.DateTimeFormatOptions) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", options);
}

export const formatOrderDate = (dateString: string) => 
    formatDate(dateString, {
        day: "2-digit",
        month: "short", 
        year: "numeric"
    });

export const formatUserDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric", 
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

export const formatOrderTime = (dateString: string) =>
    formatTime(dateString, {
        hour: "2-digit",
        minute: "2-digit", 
        hour12: true
    });

export const formatCurrency = (amount: number, currency = "THB") => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

// export const formatOrderCurrency = (amount: number) => formatCurrency(amount, "THB");