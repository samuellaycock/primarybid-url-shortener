/* istanbul ignore file */
import { Request, Response } from "express";
import { StatusCodes } from "../../enums";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function internalServerError(error: Error, req: Request, res: Response, next: () => void): Response {
    return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
            status: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            error: "Internal server error"
        });
}
