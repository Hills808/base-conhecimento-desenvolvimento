/** Refresh an open attachment list periodically and when the page becomes active. */
export function watchAttachmentList(
  refresh: () => void,
  targetWindow: Window = window,
  targetDocument: Document = document,
) {
  const refreshWhenVisible = () => {
    if (targetDocument.visibilityState === 'visible') refresh();
  };
  refresh();
  const timer = targetWindow.setInterval(refreshWhenVisible, 20_000);
  targetWindow.addEventListener('focus', refreshWhenVisible);
  targetDocument.addEventListener('visibilitychange', refreshWhenVisible);
  return () => {
    targetWindow.clearInterval(timer);
    targetWindow.removeEventListener('focus', refreshWhenVisible);
    targetDocument.removeEventListener('visibilitychange', refreshWhenVisible);
  };
}
