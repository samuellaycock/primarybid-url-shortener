import { Request, Response } from "express";
import { StatusCodes } from "../../enums"

export default function notFound(req: Request, res: Response): void {
    res
        .status(StatusCodes.NOT_FOUND)
        .json({
            status: StatusCodes.NOT_FOUND,
            success: false,
            error: "Not found"
        });
}
