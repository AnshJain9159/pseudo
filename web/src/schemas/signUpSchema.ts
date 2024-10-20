import { z } from "zod";

export const fullNameValidation = z
  .string()
  .min(2, "Full name must be at least 2 characters")
  .max(50, "Full name must not be more than 50 characters")
  .regex(/^[a-zA-Z\s]+$/, "Full name must contain only letters and spaces");

export const signUpSchema = z.object({
  fullName: fullNameValidation,
  email: z.string().email({ message: "Invalid Email Address" }),
  password: z.string().min(4, { message: "Password must be at least 4 characters" }),
  role: z.enum(["teacher", "student"], { 
    errorMap: () => ({ message: "Role must be either teacher or student" })
  })
});