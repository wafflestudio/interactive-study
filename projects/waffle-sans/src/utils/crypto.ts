export const encoder = (str: string) => {
  return btoa(encodeURIComponent(str));
};

export const decoder = (url: URL, key: string) => {
  const param = url.searchParams.get(key);
  return param ? decodeURIComponent(atob(param)) : '';
};

export const decodeParams = (url: URL) => {
  const decodedSender = decoder(url, 'sender');
  const decodedContent = decoder(url, 'content');
  const decodedReceiver = decoder(url, 'receiver');
  const decodedSans = decoder(url, 'sans');
  const decodedMode = decoder(url, 'mode');

  return {
    sender: decodedSender,
    content: decodedContent,
    receiver: decodedReceiver,
    sans: decodedSans,
    mode: decodedMode,
  };
};
