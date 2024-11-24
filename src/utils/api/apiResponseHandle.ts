export const handleResponseOk = (data: object, message: string, status: string | number = 200) => {
  const statusCode = typeof status === 'number' ? status.toString() : status;
  return {
    code: statusCode,
    message,
    ...data,
  }
}