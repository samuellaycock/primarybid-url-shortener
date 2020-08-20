import { Request, Response } from "express";
import { Url } from "../../models";
import { StatusCodes } from "../../enums";

export default async function getAllUrls(req: Request, res: Response): Promise<Response> {
    const { query } = req;
    const { page = 1, limit = 25 } = query;
    const parsedPage = parseInt(page as string, 10);
    const parsedLimit = parseInt(limit as string, 10);

    if (Number.isNaN(parsedPage) || parsedPage < 1) {
        return res.status(StatusCodes.BAD_REQUEST)
            .json({
                status: StatusCodes.BAD_REQUEST,
                success: false,
                error: "'page' must be a valid positive number"
            });
    }

    if (Number.isNaN(parsedLimit) || parsedLimit < 1) {
        return res.status(StatusCodes.BAD_REQUEST)
            .json({
                status: StatusCodes.BAD_REQUEST,
                success: false,
                error: "'limit' must be a valid positive number"
            });
    }

    const [ urls, count ] = await Promise.all([
        Url.find()
            .skip((parsedPage - 1) * parsedLimit)
            .limit(parsedLimit)
            .lean(),
        Url.countDocuments()
    ]);

    return res.status(StatusCodes.SUCCESS)
        .json({
            status: StatusCodes.SUCCESS,
            success: true,
            data: urls,
            metadata: {
                page: parsedPage,
                prevPage: parsedPage - 1 || null,
                nextPage: count > (parsedPage * parsedLimit) ? parsedPage + 1 : null,
                items: urls.length,
                totalItems: count
            }
        });
}
