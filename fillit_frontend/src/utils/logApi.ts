export const logRequest = (url: string, method: string, data: unknown) => {
  console.log(
    `%c🟢[Request] ${method.toUpperCase()} ${url}`,
    'color: green; font-weight: bold; background: #eaffea; padding: 0 2px; border-radius: 4px;',
    data
  );
};

export const logResponse = (url: string, status: number, data: unknown) => {
  console.log(
    `%c🔵[Response] ${status} ${url}`,
    'color: blue; font-weight: bold; background: #e0f7ff; padding: 0 2px; border-radius: 4px;',
    data
  );
};

export const logError = (status: number, errorMessage: unknown) => {
  console.log(
    `%c🔴[Error] ${status} ${errorMessage}`,
    'color: red; font-weight: bold; background: #ffebeb; padding: 0 2px; border-radius: 4px;'
  );
};
