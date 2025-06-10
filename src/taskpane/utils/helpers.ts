export const joinClasses = (classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// Generic property getter
function getAsyncProperty(property: any, coercionType?: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const callback = (result: Office.AsyncResult<any>) => {
      result.status === Office.AsyncResultStatus.Succeeded
        ? resolve(result.value)
        : reject(result.error);
    };

    coercionType ? property.getAsync(coercionType, callback) : property.getAsync(callback);
  });
}

// Convert ArrayBuffer to Base64
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

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

export const getAttachmentAsFile = async (
  attachment: Office.AttachmentDetailsCompose
): Promise<File> => {
  return new Promise((resolve, reject) => {
    Office.context.mailbox.item.getAttachmentContentAsync(attachment.id, async (result) => {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        try {
          let blob: Blob;

          if (typeof result.value.content === "string") {
            // Text-based attachment
            blob = new Blob([result.value.content], {
              type: attachment.attachmentType || "text/plain",
            });
          } else {
            // Binary attachment
            blob = new Blob([result.value.content], {
              type: attachment.attachmentType || "application/octet-stream",
            });
          }

          // Convert to File object
          const file = new File([blob], attachment.name, {
            type: blob.type,
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
