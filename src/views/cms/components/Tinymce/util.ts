export function getHtml(
  insertType: string,
  displayName: string,
  bucketName: string,
  objectName: string,
  url: string,
): string {
  const commonAttr = `data-bucket-name="${bucketName}" data-object-name="${objectName}"`;

  if (insertType === 'image') {
    return `<img class="editor-media editor-image" alt="${displayName}" style="max-width: 100%" ${commonAttr} src="${url}"/>`;
  } else if (insertType === 'audio') {
    return `<audio class="editor-media editor-audio" controls ${commonAttr} src="${url}"></audio>`;
  } else if (insertType === 'video') {
    return `<video class="editor-media editor-video" controls><source ${commonAttr} src="${url}" type="video/mp4"></video>`;
  } else if (insertType === 'doc') {
    return `<a class="editor-media editor-doc" target="_blank" ${commonAttr} href="${url}">${displayName}</a>`;
  } else {
    return `<a class="editor-media editor-other" target="_blank" ${commonAttr} href="${url}">${displayName}</a>`;
  }
}
