"use server";
import { ErrorType, ResponseType } from "@/models/ResponseType";
import { RegisterDto, RegisterSchema, User } from "@/models/User";
import { hash } from "bcrypt";
import { getStore } from "@netlify/blobs";

export default async function register(
  prevState: ResponseType<User>,
  formData: FormData
): Promise<ResponseType<User>> {
  const registerDto: RegisterDto = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const parsedData = RegisterSchema.safeParse(registerDto);

  if (!parsedData.success) {
    const flatErrors = parsedData.error.flatten();
    return {
      success: false,
      error: flatErrors.fieldErrors,
      errorType: ErrorType.FORM_ERROR,
    };
  }

  const { email, name, password } = parsedData.data;

  const userStore = getStore("user");
  const userInDB = await userStore.get(email, { type: "json" });

  if (userInDB) {
    return {
      success: false,
      error: { email: ["Email already exists"] },
      errorType: ErrorType.FORM_ERROR,
    };
  }

  const passwordHash = await hash(password, 10);
  const newUser: User = {
    id: email,
    name,
    email,
    password: passwordHash,
    liked: {},
  };
  await userStore.setJSON(email, newUser);

  return { success: true, data: { ...newUser, password: undefined } };
}