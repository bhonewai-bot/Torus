import { Prisma } from "@prisma/client";
import prisma from "@src/config/prisma";
import { ErrorFactory } from "@src/lib/errors";
import { calculatePagination } from "@src/utils/helpers";

export interface ServiceConfig<TList, TDetail> {
    model: any;
    listInclude?: any;
    detailInclude?: any;
    listTransformer: (data: any) => TList;
    detailTransformer: (data: any) => TDetail;
    whereBuilder: (filters: any) => any;
    defaultSortBy?: string;
    smartPaginationThreshold?: number;
    modelName: string;
    listPropertyName?: string;
}

export function createService<TList, TDetail, TFilter>(
    config: ServiceConfig<TList, TDetail>
) {
    const withErrorHandling = <T>(
        operation: () => Promise<T>,
        operationName: string,
        context?: Record<string, any>
    ): Promise<T> => {
        return operation().catch(error => {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                throw ErrorFactory.fromPrismaError(error, undefined, {
                    operation: `${config.modelName}.${operationName}`,
                    ...context,
                });
            }
            throw ErrorFactory.fromUnknownError(error);
        });
    }

    return {
        getMany: async (filters: TFilter = {} as TFilter) => {
            return withErrorHandling(async () => {
                const {
                    page = 1,
                    limit = 10,
                    sortBy = config.defaultSortBy || "createdAt",
                    sortOrder = "desc",
                } = filters as any;

                const where = config.whereBuilder(filters);
                const orderBy = { [sortBy]: sortOrder };

                if (limit === -1 || 
                    (config.smartPaginationThreshold &&
                        await config.model.count({ where }) <= config.smartPaginationThreshold
                    )
                ) {
                    const records = await config.model.findMany({
                        where,
                        include: config.listInclude,
                        orderBy,
                    });

                    const transformedRecords = records.map(config.listTransformer);
                    const pagination = calculatePagination(records.length, page, records.length); // Fix: use records.length instead of -1

                    const result: any = {
                        pagination
                    };
                    result[config.listPropertyName || 'data'] = transformedRecords;
                    
                    return result;
                }

                const skip = (page - 1) * limit;
                const [records, total] = await prisma.$transaction([
                    config.model.findMany({
                        where,
                        include: config.listInclude,
                        orderBy,
                        skip,
                        take: limit,
                    }),
                    config.model.count({ where }),
                ]);

                const transformedRecords = records.map(config.listTransformer);
                const pagination = calculatePagination(total, page, limit);

                const result: any = {
                    pagination
                };
                result[config.listPropertyName || 'data'] = transformedRecords;
                
                return result;
            }, "getMany");
        },

        getById: async (id: string) => {
            return withErrorHandling(async () => {
                const record = await config.model.findUnique({
                    where: { id },
                    include: config.detailInclude,
                });

                return record ? config.detailTransformer(record) : null;
            }, "getById", { id });
        },
    }
}