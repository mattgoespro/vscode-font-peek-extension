import { EditorMessage, LogLevel } from "../../shared/events/messages";

export const useOutputPanel = (context: string, vscodeApi: VsCodeApi) => {
  const logMessage = (level: LogLevel) => {
    return (...args: unknown[]) => {
      vscodeApi.postMessage<EditorMessage<"webview">>({
        data: { source: "webview", name: "log-output", level, moduleContext: context, args }
      });
    };
  };

  return {
    info: logMessage("info"),
    warn: logMessage("warn"),
    error: logMessage("error")
  };
};

export const useNotifications = (context: string, vscodeApi: VsCodeApi) => {
  const notify = (level: LogLevel, message: string) => {
    vscodeApi.postMessage<EditorMessage<"webview">>({
      data: { source: "webview", name: "notify", level, moduleContext: context, message }
    });
  };

  return { notify };
};

import { DependencyList, useCallback, useRef } from "react";

type MountCallback<T> = (node: T) => void;
type UseRefWithCallback<T> = (node: T | null) => void;

/**
 * A utility hook that allows you to create a ref for a React Element and
 * listen for mount events for that element.
 */
export function useRefWithCallback<T>(
  onMount: MountCallback<T>,
  dependencyList?: DependencyList[]
): UseRefWithCallback<T> {
  const ref = useRef<T | null>(null);

  const setRef = useCallback(
    (node: T | null) => {
      ref.current = node;

      if (ref.current) {
        onMount(ref.current);
      }
    },
    dependencyList ?? [onMount]
  );

  return setRef;
}

export default useRefWithCallback;
