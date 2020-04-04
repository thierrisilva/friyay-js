/* global Messenger */
// Note: Messenger is a jQuery lib

export const success = (message, hideAfter = 2) => 
  Messenger().post({
    message,
    type: 'success',
    showCloseButton: true,
    hideAfter
  });

export const failure = (message, hideAfter = 3) =>
  Messenger().post({
    message,
    type: 'error',
    showCloseButton: true,
    hideAfter
  });

export const info = (message, hideAfter = 3) =>
  Messenger().post({
    message,
    type: 'info',
    showCloseButton: true,
    hideAfter
  });

export const clear = () =>
  Messenger().hideAll();
