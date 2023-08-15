export function getHtml(insertType: string, name: string, url: string): string {
  if (insertType === 'image') {
    return `<img class="editor-media editor-image" alt="${name}" style="max-width: 100%" src="${url}"/>`;
  } else if (insertType === 'audio') {
    return `<audio class="editor-media editor-audio" controls src="${url}"></audio>`;
  } else if (insertType === 'video') {
    return `<video class="editor-media editor-video" controls><source src="${url}" type="video/mp4"></video>`;
  } else if (insertType === 'doc') {
    return `<a class="editor-media editor-doc" target="_blank" href="${url}">${name}</a>`;
  } else {
    return `<a class="editor-media editor-other" target="_blank" href="${url}">${name}</a>`;
  }
}
