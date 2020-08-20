import { Request, Response } from "express";
import { Url } from "../../models";
import { StatusCodes } from "../../enums";

export default async function deleteUrl(req: Request, res: Response): Promise<Response> {
    const { params } = req;
    const { code } = params;
    const deleted = await Url.findOneAndRemove({ code });

    if (!deleted) {
        return res.status(StatusCodes.NOT_FOUND)
            .json({
                status: StatusCodes.NOT_FOUND,
                success: false,
                error: "URL not found"
            });
    }

    return res.status(StatusCodes.SUCCESS)
        .json({
            status: StatusCodes.SUCCESS,
            success: true,
            data: "URL deleted"
        });
}
