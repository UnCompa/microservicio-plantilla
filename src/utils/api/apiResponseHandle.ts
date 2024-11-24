export const hanleResponseOk = (data: object, message: string, status: string | number) => {
  const statusCode = typeof status === 'number' ? status.toString() : status;
  return {
    code: statusCode,
    message,
    ...data,
  }
}