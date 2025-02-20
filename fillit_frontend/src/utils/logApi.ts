export const logRequest = (url: string, method: string, data: unknown) => {
  console.log(
    `%c⚪[Request] ${method.toUpperCase()} ${url}`,
    'color: #444; font-weight: bold; background: #f4f4f4; padding: 1px 4px; border-radius: 4px;',
    data
  );
};

export const logResponse = (url: string, status: number, data: unknown) => {
  console.log(
    `%c🟢[Response] ${status} ${url}`,
    'color: #007A33; font-weight: bold; background: #EAFBEA; padding: 1px 4px; border-radius: 4px;',
    data
  );
};

export const logError = (status: number, errorMessage: unknown) => {
  console.log(
    `%c🔴[Error] ${status} ${errorMessage}`,
    'color: red; font-weight: bold; background: #ffebeb; padding: 1px 4px; border-radius: 4px;'
  );
};
