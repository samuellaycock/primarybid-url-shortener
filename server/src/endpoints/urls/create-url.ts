import url from "url";
import { Request, Response } from "express";
import { Url, UrlInterface } from "../../models";
import { StatusCodes } from "../../enums";
import { LINK_URL } from "../../env";

interface CreateUrlBody {
    url: string;
}

export default async function createUrl(req: Request, res: Response): Promise<Response> {
    const { body } = req;
    const { url: urlRequest } = body as CreateUrlBody;

    if (!urlRequest) {
        return res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .json({
                status: StatusCodes.UNPROCESSABLE_ENTITY,
                success: false,
                error: "'url' is required"
            });
    }

    try {
        const parsed = url.parse(urlRequest);

        if (!parsed.hostname || !parsed.protocol) {
            throw new Error("Invalid URL");
        }
    } catch (_) {
        return res
            .status(StatusCodes.UNPROCESSABLE_ENTITY)
            .json({
                status: StatusCodes.UNPROCESSABLE_ENTITY,
                success: false,
                error: "'url' must be a valid URL"
            });
    }

    const createdUrl = await Url.create({
        url: urlRequest
    }) as UrlInterface;

    return res
        .status(StatusCodes.CREATED)
        .json({
            status: StatusCodes.CREATED,
            success: true,
            data: {
                url: createdUrl.url,
                code: createdUrl.code,
                link: `${LINK_URL}/${createdUrl.code}`,
                createdAt: createdUrl.createdAt,
                updatedAt: createdUrl.updatedAt
            }
        });
}
