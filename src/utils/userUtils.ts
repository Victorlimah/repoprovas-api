export function checkUser(userIdToken: number, userIdBody: number) {
  if (userIdToken !== userIdBody)
    throw { type: "unauthorized", message: "User id mismatch." };

  return true;
}
