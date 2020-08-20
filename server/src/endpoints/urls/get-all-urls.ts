import { Request, Response } from "express";
import { Url, UrlInterface } from "../../models";
import { StatusCodes } from "../../enums";
import { LINK_URL } from "../../env";

export default async function getAllUrls(req: Request, res: Response): Promise<Response> {
    const urls = await Url.find()
        .sort({ "_id": -1 })
        .lean();

    return res.status(StatusCodes.SUCCESS)
        .json({
            status: StatusCodes.SUCCESS,
            success: true,
            data: (urls as UrlInterface[]).map((url) => ({
                code: url.code,
                url: url.url,
                link: `${LINK_URL}/${url.code}`,
                createdAt: url.createdAt,
                updatedAt: url.updatedAt
            }))
        });
}
