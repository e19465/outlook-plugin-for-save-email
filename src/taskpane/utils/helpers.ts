/**
 * Joins an array of class names into a single space-separated string.
 * Falsy values (such as empty strings, null, or undefined) are filtered out.
 *
 * @param classes - An array of class name strings to be joined.
 * @returns A single string containing all valid class names separated by spaces.
 */
export const joinClasses = (classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

/**
 * Asynchronously retrieves a property value using the Office.js API and returns a Promise.
 *
 * @param property - The Office.js property object that provides the `getAsync` method.
 * @param coercionType - (Optional) The coercion type to use when retrieving the property value.
 * @returns A Promise that resolves with the retrieved value if successful, or rejects with an error if the operation fails.
 */
export const getAsyncProperty = (property: any, coercionType?: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const callback = (result: Office.AsyncResult<any>) => {
      result.status === Office.AsyncResultStatus.Succeeded
        ? resolve(result.value)
        : reject(result.error);
    };

    coercionType ? property.getAsync(coercionType, callback) : property.getAsync(callback);
  });
};

/**
 * Converts an ArrayBuffer to a Base64-encoded string.
 *
 * @param buffer - The ArrayBuffer to convert.
 * @returns The Base64-encoded string representation of the input buffer.
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Retrieves the content of a compose attachment as a Base64-encoded string.
 *
 * This function uses the Office.js API to asynchronously fetch the content of an attachment
 * by its ID from the current mailbox item. It handles both text-based and binary attachments,
 * converting the content to a Base64 string before resolving the promise.
 *
 * @param attachmentId - The unique identifier of the attachment to retrieve.
 * @returns A promise that resolves to the Base64-encoded content of the attachment.
 * @throws An error if the attachment content is empty or if the Office.js API call fails.
 */
export const getComposeAttachmentContent = (attachmentId: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item.getAttachmentContentAsync(attachmentId, (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        // Handle different attachment content formats
        if (result.value.content) {
          if (typeof result.value.content === "string") {
            // For text-based attachments
            resolve(btoa(result.value.content));
          } else {
            // For binary attachments
            const base64 = arrayBufferToBase64(result.value.content);
            resolve(base64);
          }
        } else {
          reject(new Error("Attachment content was empty"));
        }
      } else {
        reject(result.error);
      }
    });
  });
};

export const getMimeTypeFromFilename = (filename: string): string => {
  const extension = filename.split(".").pop()?.toLowerCase();

  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    doc: "application/msword",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    xls: "application/vnd.ms-excel",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ppt: "application/vnd.ms-powerpoint",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    txt: "text/plain",
    html: "text/html",
    csv: "text/csv",
    zip: "application/zip",
    json: "application/json",
    xml: "application/xml",
    // Add more as needed
  };

  return mimeTypes[extension || ""] || "application/octet-stream";
};

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export const getAttachmentAsFile = async (
  attachment: Office.AttachmentDetailsCompose
): Promise<File> => {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item.getAttachmentContentAsync(attachment.id, async (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        try {
          const mimeType = getMimeTypeFromFilename(attachment.name);
          let blob: Blob;

          if (typeof result.value.content === "string") {
            const byteArray = base64ToUint8Array(result.value.content);
            blob = new Blob([byteArray], { type: mimeType });
          } else {
            blob = new Blob([result.value.content], { type: mimeType });
          }

          const file = new File([blob], attachment.name, {
            type: mimeType,
            lastModified: Date.now(),
          });

          resolve(file);
        } catch (error) {
          reject(error);
        }
      } else {
        reject(result.error);
      }
    });
  });
};
