import { Request, Response } from "express";
import { StatusCodes } from "../../types"

export default (req: Request, res: Response): void => {
    res
        .status(StatusCodes.NOT_FOUND)
        .json({
            status: StatusCodes.NOT_FOUND,
            success: false,
            error: "Not found"
        });
}
