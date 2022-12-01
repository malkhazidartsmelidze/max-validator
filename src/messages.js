import {
  defaultMessage,
  messages as new_messages,
  setMessages as new_setMessages,
  setDefaultMessage as new_setDefaultMessage,
  setMessage as new_setMessage,
} from './config';

/**
 * @deprecated will be removed in next version use `V.config.messages` instead
 */
const messages = new_messages;

/**
 * @deprecated will be removed in next version use `V.config.setMessages` instead
 * @function
 */
const setMessages = new_setMessages;

/**
 * @deprecated will be removed in next version use `V.config.setDefaultMessage` instead
 * @function
 */
const setDefaultMessage = new_setDefaultMessage;

/**
 * @since 1.3
 * @function
 */
const setMessage = new_setMessage;

export {
  /**
   * @deprecated
   */
  defaultMessage,
  messages,
  setMessages,
  setDefaultMessage,
  setMessage,
};
