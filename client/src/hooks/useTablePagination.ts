import {useState} from "react";

export function useTablePagination(totalItems: number, initPage: number, initLimit: number) {
    const [currentPage, setCurrentPage] = useState(initPage);
    const [itemsPerPage, setItemsPerPage] = useState(initPage);
    const [showAll, setShowAll] = useState(false);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginationInfo = {
        total: totalItems,
        page: currentPage,
        limit: itemsPerPage,
        totalPages,
        hasPreviousPage: currentPage < totalPages,
        hasNextPage: currentPage > 1,
    }

    const changePage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    }

    const changeLimit = (limit: number) => {
        if (limit == -1) {
            setShowAll(true);
        } else {
            setShowAll(false);
            setItemsPerPage(limit);
            setCurrentPage(1);
        }
    }

    return {
        currentPage,
        itemsPerPage,
        showAll,
        paginationInfo,
        changePage,
        changeLimit
    }
}