import { signal, effect } from "@preact/signals";
import { ContainerService } from "./bindings/github.com/shreyas-shriyan/dibba";

const isContainerRunning = signal(false);

const isContainerServiceRunning = async () => {
  return await ContainerService.CheckContainerServiceRunning();
};

// const startContainerService = () => {};

// const stopContainerService = () => {};

export function App() {
  // check container service status
  effect(() => {
    (async () => {
      const isRunning = await ContainerService.CheckContainerServiceRunning();
      isContainerRunning.value = isRunning;
    })();
  });

  return (
    <div class="container text-center mx-auto max-w-4xl p-4 pt-2">
      <h1 class="text-2xl font-bold text-success">Dibba</h1>
      <div
        class="alert alert-info mb-4 flex justify-between"
        id="containerStatus"
      >
        <span>
          Container service status:{" "}
          <span id="containerStatusText">
            {isContainerRunning ? "Running" : "Not Running"}
          </span>
        </span>
        <div class="flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => ContainerService.StartContainerService()}
          >
            Start
          </button>
          <button
            className="btn btn-error"
            onClick={() => ContainerService.StopContainerService()}
          >
            Stop
          </button>
        </div>
      </div>
    </div>
  );
}
