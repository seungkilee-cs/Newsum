import { ZodError } from "zod";

const validateRequest = (schema) => (req, res, next) => {
  try {
    if (!schema) {
      return next();
    }

    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({ message: "Validation failed", issues });
    }

    req.validatedBody = result.data;
    return next();
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({ message: "Validation failed", issues });
    }

    return next(error);
  }
};

export default validateRequest;
